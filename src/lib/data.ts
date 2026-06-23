export type ModelResult = {
	name: string;
	delta: number;
	low: number;
	high: number;
	cost: number | null;
};

export type Dataset = {
	name: string;
	description: string;
	citation: string;
	icc: string;
	models: number;
	age: string;
	meta: string;
};

export const MODELS: ModelResult[] = [
	{ name: 'Gemini 3 Flash', delta: 0.108, low: 0.07, high: 0.14, cost: 14.13 },
	{ name: 'Gemini 3.1 Pro', delta: 0.108, low: 0.05, high: 0.17, cost: 15.31 },
	{ name: 'Grok 4', delta: 0.104, low: 0.03, high: 0.18, cost: 7.01 },
	{ name: 'GPT-4o Search', delta: 0.093, low: 0.02, high: 0.16, cost: 4.14 },
	{ name: 'Gemini 3.1 Flash Lite', delta: 0.092, low: 0.04, high: 0.14, cost: 14.07 },
	{ name: 'Sonar Pro Search', delta: 0.07, low: 0.02, high: 0.12, cost: 1.74 },
	{ name: 'Grok 4.2', delta: 0.052, low: 0.01, high: 0.09, cost: 6.25 },
	{ name: 'GPT-5.4', delta: 0.039, low: -0.03, high: 0.11, cost: 3.88 },
	{ name: 'Claude Opus 4.6', delta: 0.027, low: -0.02, high: 0.07, cost: 20.05 },
	{ name: 'GPT-5.2 Pro', delta: 0.016, low: -0.06, high: 0.09, cost: 72.46 }
];

export const DATASETS: Dataset[] = [
	{
		name: 'allen2024',
		description: 'News-headline veracity ratings',
		citation: 'Allen et al. (2024)',
		icc: '0.76',
		models: 10,
		age: '~2 yr',
		meta: 'Allen et al. (2024) · human ICC 0.76 · 10 models · news-headline veracity'
	},
	{
		name: 'crowdtangle',
		description: 'Social headline fact-checks',
		citation: 'CrowdTangle set',
		icc: '0.72',
		models: 10,
		age: '~3 yr',
		meta: 'CrowdTangle set · human ICC 0.72 · 10 models · social headline fact-checks'
	},
	{
		name: 'allen2021',
		description: 'News-headline veracity ratings',
		citation: 'Allen et al. (2021)',
		icc: '0.54',
		models: 10,
		age: '~5 yr',
		meta: 'Allen et al. (2021) · human ICC 0.54 · 10 models · news-headline veracity'
	}
];

// TODO add back cost
export const MODELS_BY_DATASET: Record<string, Omit<ModelResult, 'cost'>[]> = {
	"allen2021": [
		{
			"name": "Claude Opus 4.6",
			"delta": 0.0617856561000614,
			"low": 0.0014903130992372,
			"high": 0.122355316323578
		},
		{
			"name": "Gemini 3.1 Flash Lite",
			"delta": 0.130093940483797,
			"low": 0.0633367181242198,
			"high": 0.193304697148251
		},
		{
			"name": "Gemini 3.1 Pro",
			"delta": 0.154848376661705,
			"low": 0.0991921716209089,
			"high": 0.207450232904121
		},
		{
			"name": "Gemini 3 Flash",
			"delta": 0.127669261789907,
			"low": 0.0678722801778962,
			"high": 0.185788900165099
		},
		{
			"name": "GPT-4o Search",
			"delta": 0.136657477923344,
			"low": 0.0853684035918597,
			"high": 0.186382974508726
		},
		{
			"name": "GPT-5.2 Pro",
			"delta": 0.0775218924555029,
			"low": 0.0187059585193674,
			"high": 0.135111879696052
		},
		{
			"name": "GPT-5.4",
			"delta": 0.0924535982205174,
			"low": 0.0306246476794695,
			"high": 0.153051630296317
		},
		{
			"name": "Grok 4",
			"delta": 0.16500368871918,
			"low": 0.110916294352745,
			"high": 0.217603110220921
		},
		{
			"name": "Grok 4.2",
			"delta": 0.0753820942408915,
			"low": 0.00902797170391026,
			"high": 0.136833064430922
		},
		{
			"name": "Mode of models (ensemble)",
			"delta": 0.167393089786772,
			"low": 0.110081736747573,
			"high": 0.223010391379435
		},
		{
			"name": "Sonar Pro Search",
			"delta": 0.113938224781851,
			"low": 0.050480390464639,
			"high": 0.172491488093849
		}
	],
	"allen2024": [
		{
			"name": "Claude Opus 4.6",
			"delta": 0.00484316961594689,
			"low": -0.0774603887637122,
			"high": 0.0924384458321893
		},
		{
			"name": "Gemini 3.1 Flash Lite",
			"delta": 0.0321111962247088,
			"low": -0.065500359967928,
			"high": 0.124707870133482
		},
		{
			"name": "Gemini 3.1 Pro",
			"delta": 0.0692099588698349,
			"low": -0.0146813660520904,
			"high": 0.153679718129707
		},
		{
			"name": "Gemini 3 Flash",
			"delta": 0.0753933661770966,
			"low": -0.00353489067414192,
			"high": 0.153402692812845
		},
		{
			"name": "GPT-4o Search",
			"delta": -0.0293674416539315,
			"low": -0.171819405498315,
			"high": 0.0985640596490111
		},
		{
			"name": "GPT-5.2 Pro",
			"delta": -0.00221694055131971,
			"low": -0.0805549794985092,
			"high": 0.081275740959421
		},
		{
			"name": "GPT-5.4",
			"delta": 0.0398872860879038,
			"low": -0.0313709936849568,
			"high": 0.116319903434902
		},
		{
			"name": "Grok 4",
			"delta": 0.0700085918083973,
			"low": -0.0127271873463888,
			"high": 0.154258186171185
		},
		{
			"name": "Grok 4.2",
			"delta": 0.0571525108610496,
			"low": -0.0205143213648309,
			"high": 0.139319806475207
		},
		{
			"name": "Mode of models (ensemble)",
			"delta": 0.0763644995338247,
			"low": -0.00219073623047635,
			"high": 0.156326445850093
		},
		{
			"name": "Sonar Pro Search",
			"delta": 0.0477444952807993,
			"low": -0.0355886584611637,
			"high": 0.12835720122098
		}
	],
	"crowdtangle": [
		{
			"name": "Claude Opus 4.6",
			"delta": -0.00216872590698836,
			"low": -0.0809407455961242,
			"high": 0.0659689240342736
		},
		{
			"name": "Gemini 3.1 Flash Lite",
			"delta": 0.0874486689119011,
			"low": 0.00747554175383348,
			"high": 0.15530712394958
		},
		{
			"name": "Gemini 3.1 Pro",
			"delta": 0.0788253752027234,
			"low": -0.000679667473222518,
			"high": 0.143914275978905
		},
		{
			"name": "Gemini 3 Flash",
			"delta": 0.105961215647451,
			"low": 0.0448581870370149,
			"high": 0.164286365105696
		},
		{
			"name": "GPT-4o Search",
			"delta": 0.101501704360952,
			"low": 0.0513968220614266,
			"high": 0.153257041794894
		},
		{
			"name": "GPT-5.2 Pro",
			"delta": -0.0416619894021127,
			"low": -0.12415237396185,
			"high": 0.0320457121808617
		},
		{
			"name": "GPT-5.4",
			"delta": -0.0350708324664965,
			"low": -0.131516725520179,
			"high": 0.0506112362415876
		},
		{
			"name": "Grok 4",
			"delta": 0.05593969189201,
			"low": -0.0431923240088854,
			"high": 0.137137370056831
		},
		{
			"name": "Grok 4.2",
			"delta": 0.0263034442988656,
			"low": -0.0400415219903455,
			"high": 0.0863817805194843
		},
		{
			"name": "Mode of models (ensemble)",
			"delta": 0.0789411864790501,
			"low": 0.00405224666690408,
			"high": 0.142101381932795
		},
		{
			"name": "Sonar Pro Search",
			"delta": 0.0429790597523192,
			"low": -0.0176950706880745,
			"high": 0.100799311818484
		}
	]
};
