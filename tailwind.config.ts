
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
				// Beauty-themed colors - enhanced for 2025
				beauty: {
					primary: '#D4A1E9',
					secondary: '#F2C4DE',
					accent: '#F7E3EE',
					neutral: '#F9F8F8',
					dark: '#4A3B52',
				},
                // SmartBizAI Colors with richer tones - enhanced for 2025
                smartbiz: {
					primary: '#6A0DAD',    // Purple Innovation - main brand color
					secondary: '#5AA9E6',  // Technological blue - secondary
					accent: '#FFD700',     // Gold - accent color
					dark: '#1A1A1A',       // Dark tone
					light: '#F8F5FF',      // Light background
					muted: '#8E9BAE',      // Muted text color
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
                'float': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-10px) rotate(1deg)' },
                    '66%': { transform: 'translateY(-5px) rotate(-1deg)' }
                },
                'pulse-gentle': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' }
                },
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
					},
					'50%': {
						transform: 'translateY(-5px)',
						animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200px 0'
					},
					'100%': {
						backgroundPosition: 'calc(200px + 100%) 0'
					}
				},
				'gradient': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-down': {
					'0%': {
						transform: 'translateY(-100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
				'scale-in': 'scale-in 0.4s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'gradient': 'gradient 3s ease infinite',
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-down': 'slide-down 0.5s ease-out'
			},
            fontFamily: {
                'heebo': ['Heebo', 'sans-serif'],
            },
			backgroundImage: {
				'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
