export type IccSearchResult = {
  model: string;
  llm_context: string;
  beta_coefficient: number;
  se: number;
  confidence_interval_lower: number;
  confidence_interval_upper: number;
  pval: number;
  predict_lb: number;
  predict_ub: number;
  tau2: number;
  I2: number;
  Q: number;
  Q_pval: number;
  k: number;
};

export const iccSearchResults = [
  {
    "model": "modelsmode",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.111809502490602,
    "se": 0.0317916347613801,
    "confidence_interval_lower": 0.0494990433486455,
    "confidence_interval_upper": 0.174119961632559,
    "pval": 8.25204627884441e-10,
    "predict_lb": -0.118055663474418,
    "predict_ub": 0.341674668455622,
    "tau2": 0.00184342185731663,
    "I2": 62.1940662229261,
    "Q": 5.29017484872396,
    "Q_pval": 0.070999146413229,
    "k": 3
  },
  {
    "model": "gemini3flash",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.107816711840692,
    "se": 0.0187660781512161,
    "confidence_interval_lower": 0.0710358745332446,
    "confidence_interval_upper": 0.14459754914814,
    "pval": 9.17592235330712e-09,
    "predict_lb": 0.0270727944566705,
    "predict_ub": 0.188560629224714,
    "tau2": 0.0,
    "I2": 0.0,
    "Q": 1.11419933899734,
    "Q_pval": 0.572868163725303,
    "k": 3
  },
  {
    "model": "gemini31pro",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.107502041968931,
    "se": 0.0294615471020654,
    "confidence_interval_lower": 0.0497584707200528,
    "confidence_interval_upper": 0.16524561321781,
    "pval": 3.79480723385146e-09,
    "predict_lb": -0.095400554409323,
    "predict_ub": 0.310404638347186,
    "tau2": 0.0013558525346858,
    "I2": 52.2602377236856,
    "Q": 4.18937988929258,
    "Q_pval": 0.123108408158144,
    "k": 3
  },
  {
    "model": "grok4",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.104414458227338,
    "se": 0.0370954014975239,
    "confidence_interval_lower": 0.0317088073001384,
    "confidence_interval_upper": 0.177120109154538,
    "pval": 3.20344163406553e-09,
    "predict_lb": -0.169050448380462,
    "predict_ub": 0.377879364835139,
    "tau2": 0.00266345909728668,
    "I2": 66.9650027350931,
    "Q": 6.05418545659938,
    "Q_pval": 0.0484563091989066,
    "k": 3
  },
  {
    "model": "gpt4osearch",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.092633374813519,
    "se": 0.0359036269780125,
    "confidence_interval_lower": 0.0222635590222539,
    "confidence_interval_upper": 0.163003190604784,
    "pval": 6.47422853103959e-10,
    "predict_lb": -0.171069082485415,
    "predict_ub": 0.356335832112453,
    "tau2": 0.00246719058566077,
    "I2": 61.7746363040592,
    "Q": 5.23212811239355,
    "Q_pval": 0.0730899754631838,
    "k": 3
  },
  {
    "model": "gemini31flashlite",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.0923871185975851,
    "se": 0.026315351452197,
    "confidence_interval_lower": 0.0408099775107653,
    "confidence_interval_upper": 0.143964259684405,
    "pval": 1.77338184256559e-05,
    "predict_lb": -0.0598289103496791,
    "predict_ub": 0.244603147544849,
    "tau2": 0.000559052221535309,
    "I2": 28.685030793471,
    "Q": 2.80446030090538,
    "Q_pval": 0.246047628388986,
    "k": 3
  },
  {
    "model": "sonarprosearch",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.0702334654082683,
    "se": 0.0245843696275528,
    "confidence_interval_lower": 0.0220489863556444,
    "confidence_interval_upper": 0.118417944460892,
    "pval": 0.000212090327986882,
    "predict_lb": -0.0840265767080521,
    "predict_ub": 0.224493507524589,
    "tau2": 0.000680996946131413,
    "I2": 35.23175952722,
    "Q": 3.08793319905075,
    "Q_pval": 0.213532421750762,
    "k": 3
  },
  {
    "model": "grok42",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.0521810559099917,
    "se": 0.0198925837766385,
    "confidence_interval_lower": 0.0131923081483346,
    "confidence_interval_upper": 0.0911698036716489,
    "pval": 0.00871231592629016,
    "predict_lb": -0.0334098239783316,
    "predict_ub": 0.137771935798315,
    "tau2": 0.0,
    "I2": 0.0,
    "Q": 1.17831669847478,
    "Q_pval": 0.554794031107606,
    "k": 3
  },
  {
    "model": "gpt54",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.0387982070714593,
    "se": 0.0358957166860566,
    "confidence_interval_lower": -0.0315561048324652,
    "confidence_interval_upper": 0.109152518975384,
    "pval": 0.0206669983769474,
    "predict_lb": -0.223499973780608,
    "predict_ub": 0.301096387923527,
    "tau2": 0.00242785914610662,
    "I2": 62.5757048335334,
    "Q": 5.34412202315053,
    "Q_pval": 0.0691096426540936,
    "k": 3
  },
  {
    "model": "claude46",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.0273926679678716,
    "se": 0.0229805530029705,
    "confidence_interval_lower": -0.0176483882627644,
    "confidence_interval_upper": 0.0724337241985076,
    "pval": 0.171068434928813,
    "predict_lb": -0.0929199781657949,
    "predict_ub": 0.147705314101538,
    "tau2": 0.000253791939865627,
    "I2": 5.57969796896842,
    "Q": 2.11818852193747,
    "Q_pval": 0.346769751032794,
    "k": 3
  },
  {
    "model": "gpt52pro",
    "llm_context": "title+content+url+native",
    "beta_coefficient": 0.0156992255314754,
    "se": 0.036903614440989,
    "confidence_interval_lower": -0.0566305296722153,
    "confidence_interval_upper": 0.0880289807351661,
    "pval": 0.201584990001962,
    "predict_lb": -0.258886745746998,
    "predict_ub": 0.290285196809948,
    "tau2": 0.00271083898813647,
    "I2": 68.1575862671603,
    "Q": 6.28093088915982,
    "Q_pval": 0.0432626568459153,
    "k": 3
  }
] satisfies IccSearchResult[];
