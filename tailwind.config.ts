import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'sail': ['Sail', 'cursive'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Modern ocean colors
				'ocean-blue': '#0A66C2',
				'ocean-light': '#60A5FA',
				'ocean-deep': '#0B2349',
				'ocean-teal': '#06B6D4',
				
				// Modern purple palette
				'purple-deep': '#49225B',
				'purple-medium': '#6E4AB0',
				'purple-light': '#A78BFF',
				
				// Neon accent colors
				'cyan-neon': '#22D3EE',
				'pink-neon': '#EC4899',
				'yellow-bright': '#FFD000',
				
				// VisionFish neon colors
				'visionfish-neon-blue': '#00C2FF',
				'visionfish-neon-pink': '#FF00B8',
				'visionfish-neon-purple': '#A056F7',
				
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
			},
			textShadow: {
				sm: '0 1px 2px var(--tw-shadow-color)',
				DEFAULT: '0 2px 4px var(--tw-shadow-color)',
				lg: '0 8px 16px var(--tw-shadow-color)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'pulse-glow': {
					'0%': { boxShadow: '0 0 5px #81C4FF' },
					'50%': { boxShadow: '0 0 20px #4A90E2' },
					'100%': { boxShadow: '0 0 5px #81C4FF' }
				},
				'neon-pulse': {
					'0%': { boxShadow: '0 0 5px #22D3EE', filter: 'brightness(1)' },
					'50%': { boxShadow: '0 0 20px #22D3EE', filter: 'brightness(1.2)' },
					'100%': { boxShadow: '0 0 5px #22D3EE', filter: 'brightness(1)' }
				},
				'neon-glow': {
					'0%': { boxShadow: '0 0 5px #22D3EE, 0 0 10px rgba(34, 211, 238, 0.5)' },
					'100%': { boxShadow: '0 0 15px #22D3EE, 0 0 20px rgba(34, 211, 238, 0.5)' },
				},
				'pink-glow': {
					'0%': { boxShadow: '0 0 5px #FF00E5, 0 0 10px rgba(255, 0, 229, 0.5)' },
					'100%': { boxShadow: '0 0 15px #FF00E5, 0 0 20px rgba(255, 0, 229, 0.5)' },
				},
				'background-shimmer': {
					'0%': { backgroundPosition: '200% 0' },
					'100%': { backgroundPosition: '0% 0' }
				},
				'typing': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'swim': {
					'0%': { transform: 'translateX(-50px) rotate(0deg)' },
					'50%': { transform: 'translateX(calc(100vw + 50px)) rotate(10deg)' },
					'100%': { transform: 'translateX(-50px) rotate(0deg)' }
				},
				'pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' },
				},
				'bounce-soft': {
					'0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
					'50%': { transform: 'translateY(-15px)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
				},
				'ripple': {
					'0%': { transform: 'scale(0.95)', opacity: '1' },
					'100%': { transform: 'scale(2)', opacity: '0' }
				},
				'slide-in-bottom': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-top': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'sparkle': {
					'0%': { opacity: '0', transform: 'scale(0)' },
					'50%': { opacity: '1', transform: 'scale(1)' },
					'100%': { opacity: '0', transform: 'scale(0)' }
				},
				'wave': {
					'0%': { transform: 'translateX(0) translateY(0)' },
					'50%': { transform: 'translateX(10px) translateY(-5px)' },
					'100%': { transform: 'translateX(0) translateY(0)' }
				},
				'slow-zoom': {
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.1)' }
				},
				'text-wave': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'bubble-float': {
					'0%': { transform: 'translateY(100vh)', opacity: '0.5' },
					'100%': { transform: 'translateY(-50px)', opacity: '0' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
				'slide-in-top': 'slide-in-top 0.3s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'neon-pulse': 'neon-pulse 2s infinite alternate',
				'neon-glow': 'neon-glow 1.5s infinite alternate',
				'pink-glow': 'pink-glow 1.5s infinite alternate',
				'background-shimmer': 'background-shimmer 3s linear infinite',
				'typing': 'typing 1s steps(30, end)',
				'float': 'float 3s ease-in-out infinite',
				'swim': 'swim 30s linear infinite',
				'pulse': 'pulse 1s ease-in-out',
				'bounce-soft': 'bounce-soft 1s infinite',
				'ripple': 'ripple 1s ease-out',
				'sparkle': 'sparkle 2s infinite',
				'wave': 'wave 3s ease-in-out infinite',
				'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
				'text-wave': 'text-wave 3s ease-in-out infinite',
				'bubble-float': 'bubble-float 8s ease-in-out infinite',
			},
			backgroundImage: {
				'ocean-gradient': 'linear-gradient(90deg, #0B2349, #0A66C2)',
				'ocean-gradient-light': 'linear-gradient(90deg, #60A5FA, #22D3EE)',
				'purple-gradient': 'linear-gradient(90deg, #49225B, #A78BFF)',
				'neon-gradient': 'linear-gradient(90deg, #22D3EE, #EC4899)',
				'yellow-gradient': 'linear-gradient(90deg, #FFD000, #FF9500)',
				'modern-gradient': 'linear-gradient(135deg, #6E4AB0 0%, #EC4899 100%)',
				'ocean-grid': 'linear-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 165, 250, 0.1) 1px, transparent 1px)',
				'dark-grid': 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)'
			},
			boxShadow: {
				'ocean-glow': '0 0 10px #60A5FA',
				'ocean-deep': '0 0 15px #0A66C2, 0 0 30px #60A5FA',
				'neon-cyan': '0 0 10px #22D3EE, 0 0 20px rgba(34, 211, 238, 0.5)',
				'neon-pink': '0 0 10px #EC4899, 0 0 20px rgba(236, 72, 153, 0.5)',
				'neon-yellow': '0 0 10px #FFD000, 0 0 20px rgba(255, 208, 0, 0.5)',
				'neon-text': '0 0 5px #22D3EE, 0 0 10px rgba(34, 211, 238, 0.7)',
				'neon-text-pink': '0 0 5px #EC4899, 0 0 10px rgba(236, 72, 153, 0.7)',
				'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.3)',
				'neon-blue': '0 0 5px #22D3EE, 0 0 15px rgba(34, 211, 238, 0.5)',
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities, theme, variants }) {
			const utilities = {
				'.text-shadow': {
					'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.3)'
				},
				'.text-shadow-md': {
					'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.3)'
				},
				'.text-shadow-lg': {
					'text-shadow': '0 8px 16px rgba(0, 0, 0, 0.3)'
				},
				'.text-shadow-none': {
					'text-shadow': 'none'
				},
			};
			addUtilities(utilities, variants('textShadow'));
		}
	],
} satisfies Config;
