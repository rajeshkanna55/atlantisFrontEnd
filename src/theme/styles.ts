import { mode } from '@chakra-ui/theme-tools';
export const globalStyles = {
	colors: {
		brand: {
			50: '#EFEBFF',
			100: '#E9E3FF',
			200: '#422AFB',
			300: '#422AFB',
			400: '#7551FF',
			500: '#422AFB',
			600: '#3311DB',
			700: '#02044A',
			800: '#190793',
			900: '#11047A'
		},
		brandScheme: {
			50: '#EFEBFF',
			100: '#E9E3FF',
			200: '#7551FF',
			300: '#7551FF',
			400: '#7551FF',
			500: '#422AFB',
			600: '#3311DB',
			700: '#02044A',
			800: '#190793',
			900: '#02044A'
		},
		brandTabs: {
			50: '#EFEBFF',
			100: '#E9E3FF',
			200: '#422AFB',
			300: '#422AFB',
			400: '#422AFB',
			500: '#422AFB',
			600: '#3311DB',
			700: '#02044A',
			800: '#190793',
			900: '#02044A'
		},
        horizonGreen: {
          50: '#E1FFF4',
          100: '#BDFFE7',
          200: '#7BFECE',
          300: '#39FEB6',
          400: '#01F99E',
          500: '#01B574',
          600: '#01935D',
          700: '#016B44',
          800: '#00472D',
          900: '#002417',
        },
        horizonOrange: {
          50: '#FFF7EB',
          100: '#FFF1DB',
          200: '#FFE2B8',
          300: '#FFD28F',
          400: '#FFC46B',
          500: '#FFB547',
          600: '#FF9B05',
          700: '#C27400',
          800: '#855000',
          900: '#422800',
          950: '#1F1200',
        },
        horizonRed: {
          50: '#FCE8E8',
          100: '#FAD1D1',
          200: '#F4A4A4',
          300: '#EF7676',
          400: '#EA4848',
          500: '#E31A1A',
          600: '#B71515',
          700: '#891010',
          800: '#5B0B0B',
          900: '#2E0505',
          950: '#170303',
        },
        horizonBlue: {
          50: '#EBEFFF',
          100: '#D6DFFF',
          200: '#ADBFFF',
          300: '#8AA3FF',
          400: '#6183FF',
          500: '#3965FF',
          600: '#0036FA',
          700: '#0029BD',
          800: '#001B7A',
          900: '#000D3D',
          950: '#00071F',
        },
        horizonTeal: {
          50: '#EBFAF8',
          100: '#D7F4F2',
          200: '#AAE9E4',
          300: '#82DED6',
          400: '#59D4C9',
          500: '#33C3B7',
          600: '#299E94',
          700: '#1F756E',
          800: '#144D48',
          900: '#0B2826',
          950: '#051413',
        },
        horizonPurple: {
		  50: '#EFEBFF',
          100: '#E9E3FF',
          200: '#422AFB',
          300: '#422AFB',
          400: '#7551FF',
          500: '#422AFB',
          600: '#3311DB',
          700: '#02044A',
          800: '#190793',
          900: '#11047A',
        },
		secondaryGray: {
			100: '#E0E5F2',
			200: '#E1E9F8',
			300: '#F4F7FE',
			400: '#E9EDF7',
			500: '#8F9BBA',
			600: '#A3AED0',
			700: '#707EAE',
			800: '#707EAE',
			900: '#1B2559'
		},
		red: {
			100: '#FEEFEE',
			500: '#EE5D50',
			600: '#E31A1A'
		},
		blue: {
			50: '#EFF4FB',
			500: '#3965FF'
		},
		orange: {
			100: '#FFF6DA',
			500: '#FFB547'
		},
		green: {
			100: '#E6FAF5',
			500: '#01B574'
		},
		navy: {
			50: '#d0dcfb',
			100: '#aac0fe',
			200: '#a3b9f8',
			300: '#728fea',
			400: '#3652ba',
			500: '#1b3bbb',
			600: '#24388a',
			700: '#1B254B',
			800: '#111c44',
			900: '#0b1437'
		},
		gray: {
			100: '#FAFCFE'
		},
		background: {
			100: '#FFFFFF',
			900: '#0b1437'
		}
	},
	styles: {
		global: (props: any) => ({
			body: {
				overflowX: 'hidden',
				bg: mode('background.100', 'background.900')(props),
				fontFamily: 'Nunito Sans',
				letterSpacing: '-0.5px'
			},
			input: {
				color: 'gray.700'
			},
			html: {
				fontFamily: 'Nunito Sans'
			}
		})
	}
};
