import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import Layout from "@/components/Layout";
import { Mail, Phone, MapPin, Github, Instagram, Linkedin, Twitter, Facebook, Globe, ExternalLink } from 'lucide-react';
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Social media links with updated colors for better visibility
  const socialLinks = [{
    name: 'Email',
    icon: <Mail size={20} />,
    link: 'mailto:syarifrizik@gmail.com',
    handle: 'syarifrizik@gmail.com',
    color: 'from-purple-500 to-pink-500'
  }, {
    name: 'WhatsApp',
    icon: <Phone size={20} />,
    link: 'https://wa.me/62895619313339',
    handle: '+62 895 6193 13339',
    color: 'from-green-400 to-green-500'
  }, {
    name: 'GitHub',
    icon: <Github size={20} />,
    link: 'https://github.com/syarifrizik',
    handle: '@syarifrizik',
    color: 'from-gray-400 to-gray-600'
  }, {
    name: 'Instagram',
    icon: <Instagram size={20} />,
    link: 'https://www.instagram.com/lcyber_one_x/',
    handle: '@lcyber_one_x',
    color: 'from-pink-400 to-purple-400'
  }, {
    name: 'LinkedIn',
    icon: <Linkedin size={20} />,
    link: 'https://www.linkedin.com/in/syarif-rizik-8b1343271',
    handle: 'Syarif Rizik',
    color: 'from-blue-300 to-blue-500'
  }, {
    name: 'X',
    icon: <Twitter size={20} />,
    link: 'https://x.com/syarifrizik_',
    handle: '@syarifrizik_',
    color: 'from-blue-400 to-blue-600'
  }, {
    name: 'Facebook',
    icon: <Facebook size={20} />,
    link: 'https://web.facebook.com/syarif.rizik',
    handle: 'Syarif Rizik',
    color: 'from-blue-500 to-blue-700'
  }, {
    name: 'TikTok',
    icon: <Globe size={20} />,
    link: 'https://www.tiktok.com/@isentuxpro',
    handle: '@isentuxpro',
    color: 'from-teal-400 to-teal-600'
  }];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted:', formState);
    toast({
      title: 'Email Sent Successfully!',
      description: 'Thank you for your message. We will get back to you soon.'
    });
    setFormState({
      name: '',
      email: '',
      message: ''
    });
    setIsSubmitting(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <Layout>
      <motion.div className="space-y-12 py-8" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-4 text-center">
            Hubungi Kami
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
            Ada pertanyaan atau saran? Jangan ragu untuk menghubungi kami. Kami akan senang mendengar dari Anda!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div className="md:col-span-1 order-2 md:order-1" variants={itemVariants}>
            <Card className="h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Email</h3>
                    <a href="mailto:syarifrizik@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                      syarifrizik@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Telepon</h3>
                    <a href="tel:+62895619313339" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                      +62 895 6193 13339
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Lokasi</h3>
                    <p className="text-gray-600 dark:text-gray-300">Pontianak, Indonesia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div className="md:col-span-2 order-1 md:order-2" variants={itemVariants}>
            <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input id="name" name="name" placeholder="Masukkan nama Anda" value={formState.name} onChange={handleChange} className="bg-background/50 focus:border-primary" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="email@example.com" value={formState.email} onChange={handleChange} className="bg-background/50 focus:border-primary" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea id="message" name="message" placeholder="Tulis pesan Anda disini..." rows={5} value={formState.message} onChange={handleChange} className="bg-background/50 focus:border-primary min-h-[120px]" required />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </> : "Kirim Pesan"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Terhubung Dengan Kami
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((social, index) => <motion.a key={social.name} href={social.link} target="_blank" rel="noopener noreferrer" className="block" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.3,
            delay: index * 0.1
          }} whileHover={{
            scale: 1.05
          }}>
                <Card className="h-full bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 backdrop-blur-lg">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center mb-3`}>
                      {social.icon}
                    </div>
                    <h3 className="font-semibold">{social.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{social.handle}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
                      <span>Kunjungi</span>
                      <ExternalLink size={12} />
                    </div>
                  </CardContent>
                </Card>
              </motion.a>)}
          </div>
        </motion.div>
      </motion.div>
    </Layout>;
};
export default Contact;