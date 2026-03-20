import type { SubLink } from "@/ui/Card";

export type SchoolCatalogEntry = {
  key: string;
  slug: string;
  title: string;
  desc: string;
  status: "planned";
};

export type MajorCatalogEntry = {
  key: string;
  slug: string;
  title: string;
  desc: string;
  tags?: string[];
  relatedLinks?: SubLink[];
};

export type DisciplineCatalogEntry = {
  key: string;
  slug: string;
  title: string;
  desc: string;
  majors: MajorCatalogEntry[];
};

export type AdmissionsTrackEntry = {
  title: string;
  schools: string[];
  isFirstClass?: boolean;
};

export type AdmissionsCategoryEntry = {
  key: string;
  slug: string;
  duration: string;
  title: string;
  tracks: AdmissionsTrackEntry[];
};

const buildMajors = (
  disciplineSlug: string,
  majors: Array<{
    title: string;
    desc: string;
    tags?: string[];
    relatedLinks?: SubLink[];
  }>,
): MajorCatalogEntry[] =>
  majors.map((major, index) => ({
    key: `${disciplineSlug}-major-${index + 1}`,
    slug: `${disciplineSlug}-major-${String(index + 1).padStart(2, "0")}`,
    ...major,
  }));

const buildSchools = (titles: string[]): SchoolCatalogEntry[] =>
  titles.map((title, index) => ({
    key: `school-${index + 1}`,
    slug: `school-${String(index + 1).padStart(2, "0")}`,
    title,
    desc: "当前只预留学院分类入口与路由，后续在此挂接学院专业与学习资源。",
    status: "planned",
  }));

export const njuSchoolCatalog: SchoolCatalogEntry[] = buildSchools([
  "文学院",
  "历史学院",
  "哲学学院",
  "新闻传播学院",
  "法学院",
  "商学院（含经济学院、管理学院）",
  "外国语学院",
  "政府管理学院",
  "国际关系学院",
  "信息管理学院",
  "社会学院",
  "数学学院",
  "物理学院",
  "天文与空间科学学院",
  "化学学院",
  "化工学院",
  "计算机学院",
  "软件学院",
  "人工智能学院",
  "电子科学与工程学院",
  "现代工程与应用科学学院",
  "环境学院",
  "地球科学与工程学院",
  "地理与海洋科学学院",
  "大气科学学院",
  "南京赫尔辛基大气与地球系统科学学院（南赫学院）",
  "生命科学学院",
  "医学院",
  "工程管理学院",
  "匡亚明学院",
  "海外教育学院",
  "建筑与城市规划学院",
  "马克思主义学院",
  "艺术学院",
  "智能科学与技术学院",
  "智能软件与工程学院",
  "集成电路学院",
  "数字经济与管理学院",
  "能源与资源学院",
  "国家卓越工程师学院",
  "机器人与自动化学院",
  "未来技术学院",
  "前沿科学学院",
  "先进制造学院",
  "生物医学工程学院",
]);

const codeTutorLink = [{ label: "进入编程辅导", to: "/study/code-tutor" }];

export const disciplineCatalog: DisciplineCatalogEntry[] = [
  {
    key: "discipline-philosophy",
    slug: "philosophy",
    title: "哲学",
    desc: "思想史、伦理学、逻辑学与经典文本阅读资源入口。",
    majors: buildMajors("philosophy", [
      { title: "哲学", desc: "哲学导论、逻辑学、伦理学与思想史方向资源。", tags: ["经典阅读", "逻辑", "思想史"] },
    ]),
  },
  {
    key: "discipline-economics",
    slug: "economics",
    title: "经济学",
    desc: "经济理论、计量分析、金融工具与案例讨论资源入口。",
    majors: buildMajors("economics", [
      { title: "经济学", desc: "经济理论、政策分析与模型理解。", tags: ["宏观", "微观", "计量"] },
      { title: "财政学", desc: "财政政策、税收与公共预算分析。", tags: ["财政", "政策"] },
      { title: "金融工程", desc: "量化建模、金融工具和风险管理。", tags: ["量化", "风控"] },
      { title: "国际经济与贸易", desc: "国际贸易、全球市场与跨境政策资源。", tags: ["贸易", "国际化"] },
      { title: "数字经济", desc: "平台经济、数据治理与数字商业。", tags: ["数字化", "平台"] },
    ]),
  },
  {
    key: "discipline-law",
    slug: "law",
    title: "法学",
    desc: "法学、治理、社会研究与公共事务资源入口。",
    majors: buildMajors("law", [
      { title: "法学", desc: "法条研读、案例分析与法理框架。", tags: ["案例", "法理"] },
      { title: "政治学与行政学", desc: "政治理论、公共治理与制度分析。", tags: ["治理", "制度"] },
      { title: "社会学", desc: "社会调查、理论阅读与研究方法。", tags: ["调查", "理论"] },
      { title: "社会工作", desc: "社会服务、政策支持与个案方法。", tags: ["服务", "实务"] },
      { title: "国际政治", desc: "国际关系、外交与全球治理。", tags: ["国际关系", "外交"] },
      { title: "应用心理学", desc: "心理测量、行为研究和应用场景资源。", tags: ["测量", "行为"] },
    ]),
  },
  {
    key: "discipline-literature",
    slug: "literature",
    title: "文学",
    desc: "语言文学、传播写作与外语学习资源入口。",
    majors: buildMajors("literature", [
      { title: "汉语言文学", desc: "文学史、文本细读与学术写作。", tags: ["文学", "写作"] },
      { title: "汉语国际教育", desc: "中文教学、跨文化表达与语言传播。", tags: ["教学", "跨文化"] },
      { title: "英语", desc: "语言能力、翻译写作与英美文学。", tags: ["外语", "文学"] },
      { title: "法语", desc: "法语语言学习与区域文化理解。", tags: ["语言", "文化"] },
      { title: "德语", desc: "德语语言学习与区域文化理解。", tags: ["语言", "文化"] },
      { title: "西班牙语", desc: "西语表达、阅读写作与文化资源。", tags: ["语言", "文化"] },
      { title: "日语", desc: "日语语言学习、阅读与口语训练。", tags: ["语言", "表达"] },
      { title: "俄语", desc: "俄语语言学习与区域文化理解。", tags: ["语言", "文化"] },
      { title: "新闻学", desc: "新闻采写、媒介分析与传播议题。", tags: ["采写", "传播"] },
      { title: "广播电视学", desc: "视听传播、节目策划与内容生产。", tags: ["视听", "内容"] },
      { title: "广告学", desc: "品牌传播、创意策划与商业表达。", tags: ["品牌", "创意"] },
    ]),
  },
  {
    key: "discipline-history",
    slug: "history",
    title: "历史学",
    desc: "通史课程、史料阅读和考古文博资源入口。",
    majors: buildMajors("history", [
      { title: "历史学", desc: "通史框架、史料阅读与史学写作。", tags: ["通史", "史料"] },
      { title: "考古学", desc: "考古理论、田野方法与文物研究。", tags: ["田野", "考古"] },
      { title: "文物与博物馆学", desc: "文物保护、展陈策划与博物馆实务。", tags: ["文博", "展陈"] },
    ]),
  },
  {
    key: "discipline-science",
    slug: "science",
    title: "理学",
    desc: "数学、物理、化学、地学和生命科学资源入口。",
    majors: buildMajors("science", [
      { title: "数学与应用数学", desc: "数学分析、代数与建模资源。", tags: ["数学", "建模"] },
      { title: "信息与计算科学", desc: "计算方法、算法基础与数学计算。", tags: ["算法", "计算"] },
      { title: "统计学", desc: "概率统计、数据分析与推断方法。", tags: ["统计", "数据"] },
      { title: "物理学", desc: "经典物理、量子物理和实验基础。", tags: ["理论", "实验"] },
      { title: "天文学", desc: "天体物理、观测技术与宇宙学。", tags: ["观测", "宇宙"] },
      { title: "声学", desc: "波动、声学工程与测量分析。", tags: ["波动", "测量"] },
      { title: "化学", desc: "无机、有机、分析与物理化学资源。", tags: ["实验", "结构"] },
      { title: "应用化学", desc: "应用化学、材料与工艺方向资源。", tags: ["应用", "材料"] },
      { title: "地理科学", desc: "自然地理、区域分析与地图方法。", tags: ["区域", "地理"] },
      { title: "自然地理与资源环境", desc: "资源环境分析与生态治理基础。", tags: ["资源", "环境"] },
      { title: "大气科学", desc: "气象动力、气候和观测分析。", tags: ["气候", "观测"] },
      { title: "海洋科学", desc: "海洋环境、海洋过程和数据分析。", tags: ["海洋", "环境"] },
      { title: "生物科学", desc: "细胞、生化和生命系统基础。", tags: ["生命", "实验"] },
      { title: "生物技术", desc: "分子技术、实验方法与应用场景。", tags: ["技术", "实验"] },
      { title: "生态学", desc: "生态系统、保护与环境影响分析。", tags: ["生态", "保护"] },
      { title: "地质学", desc: "地球演化、岩石矿物与地质调查。", tags: ["地质", "调查"] },
    ]),
  },
  {
    key: "discipline-engineering",
    slug: "engineering",
    title: "工学",
    desc: "信息技术、电子通信、材料能源与工程实践资源入口。",
    majors: buildMajors("engineering", [
      { title: "电子信息科学与技术", desc: "电子系统、信号处理与信息技术基础。", tags: ["电子", "信号"], relatedLinks: codeTutorLink },
      { title: "通信工程", desc: "通信原理、网络系统与传输技术。", tags: ["通信", "网络"], relatedLinks: codeTutorLink },
      { title: "微电子科学与工程", desc: "半导体器件与集成电路基础。", tags: ["芯片", "器件"] },
      { title: "集成电路设计与集成系统", desc: "IC 设计、验证与系统集成。", tags: ["IC", "设计"] },
      { title: "计算机科学与技术", desc: "程序设计、系统、算法与 AI 方向资源。", tags: ["编程", "系统", "算法"], relatedLinks: codeTutorLink },
      { title: "软件工程", desc: "软件开发、架构、测试与协作实践。", tags: ["软件", "测试"], relatedLinks: codeTutorLink },
      { title: "智能科学与技术", desc: "智能系统、算法与应用开发资源。", tags: ["智能", "算法"], relatedLinks: codeTutorLink },
      { title: "人工智能相关方向", desc: "机器学习、深度学习与 AI 应用资源。", tags: ["AI", "模型"], relatedLinks: codeTutorLink },
      { title: "建筑学", desc: "空间设计、建筑表达与设计实践。", tags: ["设计", "空间"] },
      { title: "城乡规划", desc: "城市分析、规划方法与空间治理。", tags: ["城市", "规划"] },
      { title: "环境工程", desc: "污染治理、工程系统与环保技术。", tags: ["治理", "工程"] },
      { title: "环境科学", desc: "环境系统、监测与可持续分析。", tags: ["环境", "监测"] },
      { title: "材料物理", desc: "材料结构、性能与物理机制。", tags: ["材料", "结构"] },
      { title: "材料化学", desc: "材料制备、反应与应用场景。", tags: ["材料", "化学"] },
      { title: "光电信息科学与工程", desc: "光学、光电器件与信息应用。", tags: ["光电", "器件"] },
      { title: "新能源科学与工程", desc: "新能源、储能与工程系统。", tags: ["能源", "储能"] },
      { title: "工业工程", desc: "系统优化、流程设计与运营分析。", tags: ["优化", "管理"] },
    ]),
  },
  {
    key: "discipline-medicine",
    slug: "medicine",
    title: "医学",
    desc: "医学基础、临床训练与生医交叉资源入口。",
    majors: buildMajors("medicine", [
      { title: "临床医学", desc: "医学基础、临床学习与病例训练。", tags: ["临床", "病例"] },
      { title: "口腔医学", desc: "口腔临床、诊疗与基础医学知识。", tags: ["口腔", "临床"] },
      { title: "基础医学", desc: "解剖、生理、生化与病理基础。", tags: ["基础", "实验"] },
      { title: "预防医学", desc: "公共卫生、流行病学与健康治理。", tags: ["公共卫生", "流调"] },
      { title: "药学", desc: "药理、药物分析和药学实验。", tags: ["药理", "实验"] },
      { title: "生物医学工程", desc: "医学与工程交叉、设备与系统设计。", tags: ["交叉", "工程"] },
    ]),
  },
  {
    key: "discipline-management",
    slug: "management",
    title: "管理学",
    desc: "管理基础、信息管理与商业实践资源入口。",
    majors: buildMajors("management", [
      { title: "工商管理", desc: "管理理论、组织与商业分析。", tags: ["管理", "商业"] },
      { title: "会计学", desc: "财务核算、报表与审计基础。", tags: ["财务", "报表"] },
      { title: "人力资源管理", desc: "组织、招聘与人才发展。", tags: ["人力", "组织"] },
      { title: "信息管理与信息系统", desc: "信息系统、数据管理与业务分析。", tags: ["系统", "数据"], relatedLinks: codeTutorLink },
      { title: "图书馆学", desc: "知识组织、检索与资源服务。", tags: ["知识组织", "服务"] },
      { title: "档案学", desc: "档案整理、信息治理与数字归档。", tags: ["档案", "治理"] },
      { title: "电子商务", desc: "平台运营、数字商业与营销分析。", tags: ["电商", "平台"] },
    ]),
  },
  {
    key: "discipline-arts",
    slug: "arts",
    title: "艺术学",
    desc: "艺术理论、戏文创作与数字媒体表达资源入口。",
    majors: buildMajors("arts", [
      { title: "艺术史论", desc: "艺术史、理论与视觉文化研究。", tags: ["艺术史", "理论"] },
      { title: "戏剧影视文学", desc: "剧作、影视文本与内容创作。", tags: ["剧作", "影视"] },
      { title: "数字媒体艺术", desc: "数字内容、交互表达与作品集支持。", tags: ["数字媒体", "创作"] },
    ]),
  },
];

export const admissionsCategoryCatalog: AdmissionsCategoryEntry[] = [
  {
    key: "admissions-marxism-theory",
    slug: "marxism-theory",
    duration: "4",
    title: "马克思主义理论",
    tracks: [{ title: "马克思主义理论", schools: ["马克思主义学院"] }],
  },
  {
    key: "admissions-drama-film-literature",
    slug: "drama-film-literature",
    duration: "4",
    title: "戏剧影视文学",
    tracks: [{ title: "戏剧影视文学", schools: ["文学院"] }],
  },
  {
    key: "admissions-chinese-language-literature",
    slug: "chinese-language-literature",
    duration: "4",
    title: "汉语言文学",
    tracks: [{ title: "汉语言文学", schools: ["文学院"], isFirstClass: true }],
  },
  {
    key: "admissions-humanities-experimental-class",
    slug: "humanities-experimental-class",
    duration: "4",
    title: "人文科学试验班",
    tracks: [
      { title: "汉语言文学", schools: ["文学院"], isFirstClass: true },
      { title: "历史学", schools: ["历史学院"], isFirstClass: true },
      { title: "考古学", schools: ["历史学院"], isFirstClass: true },
      { title: "考古学（文物鉴定方向）", schools: ["历史学院"], isFirstClass: true },
      { title: "哲学", schools: ["哲学学院"], isFirstClass: true },
      { title: "汉语国际教育", schools: ["海外教育学院"] },
    ],
  },
  {
    key: "admissions-journalism-big-data-dual-degree",
    slug: "journalism-big-data-dual-degree",
    duration: "4",
    title: "新闻学（大数据传播实验班）双学士学位",
    tracks: [
      { title: "新闻学", schools: ["新闻传播学院"], isFirstClass: true },
      { title: "广播电视学", schools: ["新闻传播学院"], isFirstClass: true },
      { title: "广告学", schools: ["新闻传播学院"], isFirstClass: true },
      { title: "新闻学（大数据传播实验班）", schools: ["新闻传播学院", "信息管理学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-social-science-experimental-class",
    slug: "social-science-experimental-class",
    duration: "4",
    title: "社会科学试验班",
    tracks: [
      { title: "法学", schools: ["法学院"], isFirstClass: true },
      { title: "社会学", schools: ["社会学院"], isFirstClass: true },
      { title: "社会工作", schools: ["社会学院"], isFirstClass: true },
      { title: "应用心理学", schools: ["社会学院"], isFirstClass: true },
      { title: "政治学与行政学", schools: ["政府管理学院"], isFirstClass: true },
      { title: "行政管理", schools: ["政府管理学院"], isFirstClass: true },
      { title: "劳动与社会保障", schools: ["政府管理学院"], isFirstClass: true },
      { title: "国际政治", schools: ["国际关系学院"] },
      { title: "信息管理与信息系统", schools: ["信息管理学院"], isFirstClass: true },
      { title: "图书馆学", schools: ["信息管理学院"], isFirstClass: true },
      { title: "档案学", schools: ["信息管理学院"], isFirstClass: true },
      { title: "编辑出版学", schools: ["信息管理学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-economics-management-experimental-class",
    slug: "economics-management-experimental-class",
    duration: "4",
    title: "经济管理试验班（数智经济与管理）",
    tracks: [
      { title: "经济学", schools: ["商学院"], isFirstClass: true },
      { title: "金融学", schools: ["商学院"], isFirstClass: true },
      { title: "金融工程", schools: ["商学院"], isFirstClass: true },
      { title: "保险学", schools: ["商学院"] },
      { title: "国际经济与贸易", schools: ["商学院"], isFirstClass: true },
      { title: "经济学（产业经济学方向）", schools: ["商学院"], isFirstClass: true },
      { title: "财政学", schools: ["商学院"] },
      { title: "工商管理", schools: ["商学院"], isFirstClass: true },
      { title: "市场营销", schools: ["商学院"], isFirstClass: true },
      { title: "会计学", schools: ["商学院"], isFirstClass: true },
      { title: "财务管理", schools: ["商学院"], isFirstClass: true },
      { title: "电子商务", schools: ["商学院"], isFirstClass: true },
      { title: "工商管理（人力资源方向）", schools: ["商学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-foreign-languages",
    slug: "foreign-languages",
    duration: "4",
    title: "外国语言文学类",
    tracks: [
      { title: "英语", schools: ["外国语学院"], isFirstClass: true },
      { title: "俄语", schools: ["外国语学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-german-law-dual-degree",
    slug: "german-law-dual-degree",
    duration: "4",
    title: "德语（德语法学实验班）双学士学位",
    tracks: [
      { title: "德语（德语法学实验班）", schools: ["外国语学院", "法学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-science-experimental-class-kuang",
    slug: "science-experimental-class-kuang",
    duration: "4",
    title: "理科试验班（匡亚明学院大理科班）",
    tracks: [
      { title: "数学与应用数学", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "信息与计算科学", schools: ["匡亚明学院"] },
      { title: "物理学", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "化学", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "生物科学", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "物理学（生物物理学）", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "生物科学（生物化学与分子生物学）", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "天文学", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "计算机科学与技术", schools: ["匡亚明学院"], isFirstClass: true },
      { title: "计算机科学与技术（脑科学与AI方向）", schools: ["匡亚明学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-science-experimental-class-math",
    slug: "science-experimental-class-math",
    duration: "4",
    title: "理科试验班类（数理科学类）",
    tracks: [
      { title: "数学与应用数学", schools: ["数学学院"], isFirstClass: true },
      { title: "信息与计算科学", schools: ["数学学院"], isFirstClass: true },
      { title: "统计学", schools: ["数学学院"] },
      { title: "物理学", schools: ["物理学院"], isFirstClass: true },
      { title: "应用物理学", schools: ["物理学院"] },
      { title: "声学", schools: ["物理学院"], isFirstClass: true },
      { title: "天文学", schools: ["天文与空间科学学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-science-experimental-class-earth-env",
    slug: "science-experimental-class-earth-env",
    duration: "4",
    title: "理科试验班类（地球科学与资源环境类）",
    tracks: [
      { title: "大气科学", schools: ["大气科学学院"], isFirstClass: true },
      { title: "应用气象学", schools: ["大气科学学院"] },
      { title: "环境工程", schools: ["环境学院"], isFirstClass: true },
      { title: "环境科学", schools: ["环境学院"], isFirstClass: true },
      { title: "地球物理学", schools: ["地球科学与工程学院"] },
      { title: "地质学", schools: ["地球科学与工程学院"], isFirstClass: true },
      { title: "行星科学", schools: ["地球科学与工程学院"] },
      { title: "水文与水资源工程", schools: ["地球科学与工程学院"], isFirstClass: true },
      { title: "地质工程", schools: ["地球科学与工程学院"], isFirstClass: true },
      { title: "地下水科学与工程", schools: ["地球科学与工程学院"] },
      { title: "地理信息科学", schools: ["地理与海洋科学学院"], isFirstClass: true },
      { title: "自然地理与资源环境", schools: ["地理与海洋科学学院"], isFirstClass: true },
      { title: "人文地理与城乡规划", schools: ["地理与海洋科学学院"] },
      { title: "海洋科学", schools: ["地理与海洋科学学院"], isFirstClass: true },
      { title: "地理科学", schools: ["地理与海洋科学学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-science-experimental-class-chem-life",
    slug: "science-experimental-class-chem-life",
    duration: "4",
    title: "理科试验班类（化学与生命科学类）",
    tracks: [
      { title: "化学", schools: ["化学化工学院"], isFirstClass: true },
      { title: "应用化学", schools: ["化学化工学院"] },
      { title: "化学（化学生物学）", schools: ["化学化工学院"], isFirstClass: true },
      { title: "生物科学", schools: ["生命科学学院"], isFirstClass: true },
      { title: "生物技术", schools: ["生命科学学院"], isFirstClass: true },
      { title: "生态学", schools: ["生命科学学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-engineering-experimental-class",
    slug: "engineering-experimental-class",
    duration: "4",
    title: "工科试验班",
    tracks: [
      { title: "新能源科学与工程", schools: ["现代工程与应用科学学院"] },
      { title: "光电信息科学与工程", schools: ["现代工程与应用科学学院"], isFirstClass: true },
      { title: "生物医学工程", schools: ["现代工程与应用科学学院"] },
      { title: "材料物理", schools: ["现代工程与应用科学学院"], isFirstClass: true },
      { title: "材料化学", schools: ["现代工程与应用科学学院"] },
      { title: "工业工程", schools: ["工程管理学院"], isFirstClass: true },
      { title: "金融工程", schools: ["工程管理学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-electronic-information",
    slug: "electronic-information",
    duration: "4",
    title: "电子信息类",
    tracks: [
      { title: "电子信息科学与技术", schools: ["电子科学与工程学院"], isFirstClass: true },
      { title: "微电子科学与工程", schools: ["电子科学与工程学院"], isFirstClass: true },
      { title: "通信工程", schools: ["电子科学与工程学院"] },
      { title: "集成电路设计与集成系统", schools: ["电子科学与工程学院"] },
    ],
  },
  {
    key: "admissions-integrated-circuit-zhicheng",
    slug: "integrated-circuit-zhicheng",
    duration: "4",
    title: "集成电路设计与集成系统（至诚班）",
    tracks: [
      { title: "集成电路设计与集成系统（至诚班）", schools: ["集成电路学院", "电子科学与工程学院"] },
    ],
  },
  {
    key: "admissions-computer-science",
    slug: "computer-science",
    duration: "4",
    title: "计算机科学与技术",
    tracks: [{ title: "计算机科学与技术", schools: ["计算机学院"], isFirstClass: true }],
  },
  {
    key: "admissions-computer-science-zhicheng",
    slug: "computer-science-zhicheng",
    duration: "4",
    title: "计算机科学与技术（至诚班）",
    tracks: [{ title: "计算机科学与技术（至诚班）", schools: ["计算机学院"], isFirstClass: true }],
  },
  {
    key: "admissions-artificial-intelligence",
    slug: "artificial-intelligence",
    duration: "4",
    title: "人工智能",
    tracks: [{ title: "人工智能", schools: ["人工智能学院"], isFirstClass: true }],
  },
  {
    key: "admissions-artificial-intelligence-zhicheng",
    slug: "artificial-intelligence-zhicheng",
    duration: "4",
    title: "人工智能（至诚班）",
    tracks: [{ title: "人工智能（至诚班）", schools: ["人工智能学院"], isFirstClass: true }],
  },
  {
    key: "admissions-software-engineering",
    slug: "software-engineering",
    duration: "4",
    title: "软件工程",
    tracks: [{ title: "软件工程", schools: ["软件学院"], isFirstClass: true }],
  },
  {
    key: "admissions-software-engineering-zhicheng",
    slug: "software-engineering-zhicheng",
    duration: "4",
    title: "软件工程（至诚班）",
    tracks: [{ title: "软件工程（至诚班）", schools: ["软件学院"], isFirstClass: true }],
  },
  {
    key: "admissions-software-econ-dual-degree",
    slug: "software-econ-dual-degree",
    duration: "4",
    title: "软件工程（软工经济创新班）双学士学位",
    tracks: [{ title: "软件工程（软工经济创新班）", schools: ["软件学院", "商学院"], isFirstClass: true }],
  },
  {
    key: "admissions-software-business-dual-degree",
    slug: "software-business-dual-degree",
    duration: "4",
    title: "软件工程（软工商业创新班）双学士学位",
    tracks: [{ title: "软件工程（软工商业创新班）", schools: ["软件学院", "商学院"], isFirstClass: true }],
  },
  {
    key: "admissions-clinical-medicine-5plus3",
    slug: "clinical-medicine-5plus3",
    duration: "5",
    title: "临床医学（5+3一体化）",
    tracks: [{ title: "临床医学（5+3一体化）", schools: ["医学院"], isFirstClass: true }],
  },
  {
    key: "admissions-clinical-medicine-excellence",
    slug: "clinical-medicine-excellence",
    duration: "5",
    title: "临床医学（卓越医师班）",
    tracks: [{ title: "临床医学（卓越医师班）", schools: ["医学院"], isFirstClass: true }],
  },
  {
    key: "admissions-stomatology",
    slug: "stomatology",
    duration: "5",
    title: "口腔医学",
    tracks: [{ title: "口腔医学", schools: ["医学院"], isFirstClass: true }],
  },
  {
    key: "admissions-computer-finance-dual-degree",
    slug: "computer-finance-dual-degree",
    duration: "4",
    title: "计算机科学与技术（计算机金融实验班）双学士学位",
    tracks: [{ title: "计算机科学与技术（计算机金融实验班）", schools: ["工程管理学院", "计算机学院"], isFirstClass: true }],
  },
  {
    key: "admissions-industrial-engineering-robotics-dual-degree",
    slug: "industrial-engineering-robotics-dual-degree",
    duration: "4",
    title: "工业工程（智能系统集成实验班）双学士学位",
    tracks: [{ title: "工业工程（智能系统集成实验班）", schools: ["工程管理学院", "机器人与自动化学院"], isFirstClass: true }],
  },
  {
    key: "admissions-environment-health-experimental-class",
    slug: "environment-health-experimental-class",
    duration: "4",
    title: "环境科学与工程类（环境与健康实验班）",
    tracks: [
      { title: "环境工程", schools: ["环境学院"], isFirstClass: true },
      { title: "环境科学", schools: ["环境学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-smart-habitat-experimental-class",
    slug: "smart-habitat-experimental-class",
    duration: "4",
    title: "工科试验班（智慧人居实验班）",
    tracks: [
      { title: "建筑学", schools: ["建筑与城市规划学院"], isFirstClass: true },
      { title: "城乡规划", schools: ["建筑与城市规划学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-architecture-planning-experimental-class",
    slug: "architecture-planning-experimental-class",
    duration: "4",
    title: "建筑类（建筑与规划实验班）",
    tracks: [
      { title: "建筑学", schools: ["建筑与城市规划学院"], isFirstClass: true },
      { title: "城乡规划", schools: ["建筑与城市规划学院"], isFirstClass: true },
    ],
  },
  {
    key: "admissions-technology-science-experimental-class",
    slug: "technology-science-experimental-class",
    duration: "4",
    title: "技术科学试验班",
    tracks: [
      { title: "智能科学与技术", schools: ["智能科学与技术学院"] },
      { title: "自动化（机器人方向）", schools: ["机器人与自动化学院"] },
      { title: "集成电路设计与集成系统", schools: ["集成电路学院"] },
      { title: "数字经济", schools: ["数字经济与管理学院"] },
    ],
  },
  {
    key: "admissions-atmospheric-science-joint-program",
    slug: "atmospheric-science-joint-program",
    duration: "4",
    title: "大气科学（中外合作办学）",
    tracks: [{ title: "大气科学（中外合作办学）", schools: ["南京赫尔辛基大气与地球系统科学学院（南赫学院）"], isFirstClass: true }],
  },
];

export const getDisciplineBySlug = (slug?: string) =>
  disciplineCatalog.find((discipline) => discipline.slug === slug);

export const getSchoolBySlug = (slug?: string) =>
  njuSchoolCatalog.find((school) => school.slug === slug);

export const getAdmissionsCategoryBySlug = (slug?: string) =>
  admissionsCategoryCatalog.find((category) => category.slug === slug);

export const getMajorByDisciplineAndSlug = (
  disciplineSlug?: string,
  majorSlug?: string,
) => {
  const discipline = getDisciplineBySlug(disciplineSlug);
  if (!discipline) return null;
  const major = discipline.majors.find((item) => item.slug === majorSlug);
  return major ? { discipline, major } : null;
};
