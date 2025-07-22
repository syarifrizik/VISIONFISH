
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePaymentRequest {
  userId: string;
  customerDetails: {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
}

interface MidtransResponse {
  token: string;
  redirect_url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'POST' && path.endsWith('/create-payment')) {
      return await handleCreatePayment(req, supabaseClient);
    } else if (req.method === 'POST' && path.endsWith('/payment-notification')) {
      return await handlePaymentNotification(req, supabaseClient);
    } else if (req.method === 'GET' && path.endsWith('/payment-status')) {
      return await handlePaymentStatus(req, supabaseClient);
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Error in midtrans-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

async function handleCreatePayment(req: Request, supabaseClient: any) {
  const { userId, customerDetails }: CreatePaymentRequest = await req.json();
  
  // Generate unique order ID
  const orderId = `visionfish-premium-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const grossAmount = 49000; // Rp49.000

  // Create transaction record in database
  const { data: transaction, error: dbError } = await supabaseClient
    .from('midtrans_transactions')
    .insert({
      user_id: userId,
      order_id: orderId,
      gross_amount: grossAmount,
      currency: 'IDR',
      transaction_status: 'pending'
    })
    .select()
    .single();

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }

  // Prepare Midtrans Snap API request
  const snapData = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount
    },
    customer_details: customerDetails,
    item_details: [
      {
        id: 'visionfish-premium',
        price: grossAmount,
        quantity: 1,
        name: 'VisionFish Premium Subscription (1 Bulan)'
      }
    ],
    credit_card: {
      secure: true
    }
  };

  // Call Midtrans Snap API
  const midtransServerKey = Deno.env.get('MIDTRANS_SERVER_KEY');
  const authString = btoa(midtransServerKey + ':');
  
  const snapResponse = await fetch('https://app.midtrans.com/snap/v1/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify(snapData)
  });

  if (!snapResponse.ok) {
    const errorData = await snapResponse.text();
    throw new Error(`Midtrans API error: ${errorData}`);
  }

  const snapResult: MidtransResponse = await snapResponse.json();

  // Update transaction with Snap token
  await supabaseClient
    .from('midtrans_transactions')
    .update({
      snap_token: snapResult.token,
      snap_redirect_url: snapResult.redirect_url
    })
    .eq('id', transaction.id);

  return new Response(
    JSON.stringify({
      success: true,
      orderId: orderId,
      snapToken: snapResult.token,
      redirectUrl: snapResult.redirect_url
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}

async function handlePaymentNotification(req: Request, supabaseClient: any) {
  const notificationData = await req.json();
  
  const {
    order_id,
    transaction_status,
    transaction_id,
    payment_type,
    transaction_time,
    settlement_time
  } = notificationData;

  console.log('Midtrans notification received:', notificationData);

  // Update transaction status in database
  const { error } = await supabaseClient
    .from('midtrans_transactions')
    .update({
      transaction_id,
      transaction_status,
      payment_type,
      transaction_time: transaction_time ? new Date(transaction_time).toISOString() : null,
      settlement_time: settlement_time ? new Date(settlement_time).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('order_id', order_id);

  if (error) {
    console.error('Error updating transaction:', error);
    return new Response('Error updating transaction', { status: 500, headers: corsHeaders });
  }

  return new Response('OK', { status: 200, headers: corsHeaders });
}

async function handlePaymentStatus(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get('order_id');

  if (!orderId) {
    return new Response('Order ID required', { status: 400, headers: corsHeaders });
  }

  const { data: transaction, error } = await supabaseClient
    .from('midtrans_transactions')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) {
    return new Response('Transaction not found', { status: 404, headers: corsHeaders });
  }

  return new Response(
    JSON.stringify(transaction),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  );
}
