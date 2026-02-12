import React, { useState, useMemo, memo } from "react";
import { 
  Users, 
  DollarSign, 
  Zap, 
  ArrowRight,
  Sparkles,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Unlock,
  Briefcase,
  BarChart,
  Target
} from "lucide-react";

/**
 * WINSHIP LABS BRAND CONFIG
 */
const COLORS = {
  black: "#010101",
  cream: "#FAF7F2",
  mint: "#EEF3ED",
  yellow: "#F8D637",
  blue: "#198EC8",
  pink: "#FF5780",
};

// Inject Google Fonts & Custom Animations
const FontStyles = memo(() => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap');
    
    :root {
      --font-heading: 'Archivo', sans-serif;
      --font-body: 'Archivo', sans-serif;
    }

    body {
      font-family: var(--font-body);
      background-color: ${COLORS.cream};
      color: ${COLORS.black};
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      font-weight: 700; /* Default to bold for headers */
    }

    /* Custom Range Slider */
    input[type=range] {
      -webkit-appearance: none; 
      background: transparent; 
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: ${COLORS.black};
      margin-top: -10px;
      cursor: pointer;
      border: 2px solid ${COLORS.cream};
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      background: #CBD5E1;
      border-radius: 2px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: ${COLORS.black};
    }
    
    /* Animation for the analysis box */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }

    /* 8-second Interval Bounce Animation (Active for ~2 seconds) */
    @keyframes bounce-interval {
      0% { transform: translateY(0); }
      5% { transform: translateY(-5px); }  /* ~0.4s */
      10% { transform: translateY(0); }    /* ~0.8s */
      15% { transform: translateY(-3px); } /* ~1.2s */
      20% { transform: translateY(0); }    /* ~1.6s */
      100% { transform: translateY(0); }   /* Rest for 6s */
    }
    .animate-bounce-interval {
      animation: bounce-interval 8s infinite ease-in-out;
    }
  `}</style>
));

// --- Utility Functions ---

const numberOrZero = (value: string) => {
  const cleanValue = value.replace(/,/g, '');
  const n = Number(cleanValue);
  return isNaN(n) ? 0 : n;
};

const formatCurrency = (value: number) => {
  if (!isFinite(value)) return "-";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

// Handle bold text (**text**)
const parseInlineStyles = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
};

// --- Improved Markdown Parser ---
const MarkdownRenderer = memo(({ text }: { text: string }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const blocks: { type: 'list' | 'paragraph' | 'header', content: string | string[], level?: number }[] = [];
  let currentList: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: [...currentList] });
        currentList = [];
      }
      return; 
    }

    // Check for Headers (### Header)
    if (trimmed.startsWith('#')) {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: [...currentList] });
        currentList = [];
      }
      const level = trimmed.match(/^#+/)?.[0].length || 1;
      const content = trimmed.replace(/^#+\s*/, '');
      blocks.push({ type: 'header', content, level });
    }
    // Check for bullet points
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      currentList.push(trimmed.replace(/^[*\-•]\s+/, ''));
    } 
    else {
      if (currentList.length > 0) {
        blocks.push({ type: 'list', content: [...currentList] });
        currentList = [];
      }
      blocks.push({ type: 'paragraph', content: trimmed });
    }
  });

  if (currentList.length > 0) {
    blocks.push({ type: 'list', content: currentList });
  }

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-800 font-sans">
      {blocks.map((block, i) => {
        if (block.type === 'header') {
           // Dynamic styling based on header level if needed, mostly bold for now
           return (
             <h4 key={i} className="font-extrabold text-slate-900 mt-4 mb-2 text-base" dangerouslySetInnerHTML={{ __html: parseInlineStyles(block.content as string) }} />
           );
        } else if (block.type === 'list') {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2 marker:text-slate-400">
              {(block.content as string[]).map((item, j) => (
                <li key={j} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
              ))}
            </ul>
          );
        } else {
          return (
            <p key={i} dangerouslySetInnerHTML={{ __html: parseInlineStyles(block.content as string) }} />
          );
        }
      })}
    </div>
  );
});

// --- Memoized Header ---
const Header = memo(() => (
  <header className="w-full max-w-4xl px-6 pt-16 pb-12 text-center space-y-6">
    <div className="inline-flex items-center justify-center p-3 rounded-full bg-white shadow-sm mb-4">
       <Zap className="w-6 h-6" style={{ color: COLORS.black }} />
    </div>
    <h1 className="text-5xl md:text-6xl tracking-tight leading-[0.95]" style={{ color: COLORS.black }}>
      Stop paying smart people <br />
      <span className="relative inline-block">
        <span className="relative z-10">to do dumb work.</span>
        <span
          className="absolute bottom-1 left-0 right-0 h-4 -z-0 opacity-40 transform -rotate-1"
          style={{ backgroundColor: COLORS.yellow }}
        ></span>
      </span>
    </h1>
    <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto opacity-80" style={{ fontFamily: 'var(--font-heading)' }}>
      Unlock the leverage to outpace teams twice your size.
    </p>
  </header>
));

// --- Main Component ---

export default function WinshipRoiCalculator() {
  const [teamSize, setTeamSize] = useState<string>("25");
  const [annualCost, setAnnualCost] = useState<string>("65000");
  const [wasteHours, setWasteHours] = useState<string>("10");

  // Executive Brief State
  const [industry, setIndustry] = useState<string>("");
  const [adoptionLevel, setAdoptionLevel] = useState<string>("Low");
  const [interestedTier, setInterestedTier] = useState<string>("sprint");
  
  // Selection State for Offer Cards
  const [selectedOfferKey, setSelectedOfferKey] = useState<string | null>(null);

  // Gemini Integration State
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const teamSizeNum = Math.max(1, numberOrZero(teamSize) || 1);
  const annualCostNum = Math.max(0, numberOrZero(annualCost));
  const wasteHoursNum = Math.max(0, numberOrZero(wasteHours));
  
  // Standard multiplier for time savings (1.5x)
  const BASE_REVENUE_MULTIPLIER = 1.5;

  const hourlyCost = annualCostNum > 0 ? annualCostNum / 2080 : 0;
  const totalWastePerWeek = teamSizeNum * wasteHoursNum;
  const totalWasteCostPerYear = totalWastePerWeek * 52 * hourlyCost;

  const offers = useMemo(() => [
    {
      name: "Workflow Audit & Training", 
      key: "workshop",
      impactPercent: 0.1,
      priceType: "one_time",
      basePrice: 2400,
      badge: "Most Popular", 
      color: COLORS.blue,
      description: "We map your workflows and train your team. The goal: Clear out the busywork and identify the high-value 'impossible' tasks you’re currently skipping because they take too long.",
      guarantee: "100% Money-back Guarantee if we don't find 5x savings.", 
      anchor: null,
      guaranteeIcon: ShieldCheck,
      features: ["Workflow Mapping", "Team Training"]
    },
    {
      name: "6-Week Time Buyback",
      key: "sprint",
      impactPercent: 0.3,
      priceType: "one_time",
      basePrice: 25000,
      badge: "Best Value", 
      color: COLORS.pink,
      description: "We build custom Agentic AI systems that don't just save time—they unlock new capabilities. Your team starts delivering 'expensive' assets (research, specs) in minutes, not days.",
      guarantee: "100% Money-back Guarantee if we don't find 5x savings.", 
      anchor: null,
      guaranteeIcon: ShieldCheck,
      features: ["Agentic AI", "New Capabilities"]
    },
    {
      name: "Fractional Head of AI",
      key: "fractional",
      impactPercent: 0.45, 
      priceType: "per_month",
      basePrice: 7900,
      badge: "Scale mode",
      color: COLORS.yellow,
      description: "According to BCG, only 5% of companies are seeing real ROI. We provide the strategy and governance to ensure you join the winners circle, not the 60% who fail.",
      guarantee: "No handcuffs. Month-to-month. We re-earn your business every 30 days or you fire us.",
      anchor: "vs $250k full-time hire",
      guaranteeIcon: Unlock,
      features: ["Governance", "Strategy"]
    },
  ], []);

  const rows = useMemo(() => {
    return offers.map((offer) => {
      const weeklyHoursSaved = totalWastePerWeek * offer.impactPercent;
      
      const effectiveMultiplier = offer.key === "fractional" 
        ? 3.5 
        : BASE_REVENUE_MULTIPLIER;

      const weeklyValueCost = weeklyHoursSaved * hourlyCost;
      const weeklyValueTotal = weeklyValueCost * effectiveMultiplier;
      const annualTotalImpact = weeklyValueTotal * 52;
      
      let price: number;
      let monthlyPrice: number | null = null;
      let anchorText: React.ReactNode = "";

      // DYNAMIC PRICE & ANCHOR LOGIC
      if (offer.key === "workshop") {
        if (teamSizeNum <= 10) price = 2400;       
        else if (teamSizeNum <= 25) price = 4500;  
        else if (teamSizeNum <= 50) price = 8000;  
        else if (teamSizeNum <= 100) price = 12000;
        else price = 18000;
        
        // Anchor: Real monthly cost of waste
        const monthlyWasteCost = (totalWastePerWeek * hourlyCost) * (52/12);
        anchorText = <>vs <strong>{formatCurrency(monthlyWasteCost)}</strong> wasted / mo</>;

      } else if (offer.key === "sprint") {
        // Price tiers
        if (teamSizeNum <= 20) price = 18000;      
        else if (teamSizeNum <= 50) price = 30000; 
        else if (teamSizeNum <= 100) price = 45000;
        else price = 60000;

        // Anchor: Expensive Agency / Consultancy (approx 3-4x our price)
        let agencyCost = 60000; // Base anchor
        if (price >= 30000) agencyCost = 100000;
        if (price >= 45000) agencyCost = 150000;
        if (price >= 60000) agencyCost = 200000;
        anchorText = <>vs <strong>{formatCurrency(agencyCost)}</strong> agency build</>;

      } else if (offer.key === "fractional") {
        let monthly: number;
        // Price tiers
        if (teamSizeNum < 40) monthly = 7900;
        else if (teamSizeNum <= 99) monthly = 12000;
        else monthly = 22000; 
        
        price = monthly * 12;
        monthlyPrice = monthly;

        // Anchor: Full-Time Hire(s)
        let ftCost = 180000; // Base: Single Head of AI
        if (teamSizeNum >= 40) ftCost = 320000; // Head + Engineer
        if (teamSizeNum >= 100) ftCost = 550000; // Small AI Department
        anchorText = <>vs <strong>{formatCurrency(ftCost)}</strong> full-time cost</>;

      } else {
        price = offer.priceType === "one_time" ? offer.basePrice : offer.basePrice * 12;
      }

      const roi = price > 0 ? (annualTotalImpact - price) / price : NaN;
      const paybackMonths = weeklyValueTotal > 0 ? price / (weeklyValueTotal * 4.33) : NaN;

      const isQualified = offer.key === "fractional" ? roi > 0.2 : true;

      return { 
        ...offer, 
        weeklyHoursSaved, 
        annualTotalImpact, 
        price, 
        monthlyPrice, 
        roi, 
        paybackMonths, 
        isQualified,
        anchor: anchorText 
      };
    });
  }, [teamSizeNum, totalWastePerWeek, hourlyCost, offers, BASE_REVENUE_MULTIPLIER]);

  const selectedOfferRow = rows.find(r => r.key === interestedTier) || rows[1];

  // --- GEMINI API FUNCTION ---
  const generateBrief = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setAnalysis(null);

    const apiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";

    if (!apiKey) {
      setGenerationError("API key not configured. Please ensure GEMINI_API_KEY is configured in your environment.");
      setIsGenerating(false);
      return;
    }

    const userQuery = `
      Data:
      - Company Size: ${teamSizeNum} employees
      - Industry: ${industry || "General"}
      - Current AI Maturity: ${adoptionLevel}
      - Target Solution: ${selectedOfferRow.name}
      - Annual Waste: ${formatCurrency(totalWasteCostPerYear)}
      - Projected Uplift: ${formatCurrency(selectedOfferRow.annualTotalImpact || 0)}
      - Investment: ${formatCurrency(selectedOfferRow.price)}
      - Average Employee Cost: ${formatCurrency(annualCostNum)}
      - Hours Wasted Per Person: ${wasteHoursNum}
      
      Task: Write a spartan, bulleted executive summary for a CFO justifying this specific investment with Winship Labs.
      
      Style Guidelines:
      - Use markdown formatting (bolding, lists).
      - Use headers like ## Problem, ## Solution to organize.
      - Use short, declarative sentences.
      - No em-dashes (—). Use colons or periods.
      - No fluff or corporate jargon.
      - Use standard bullet points.
      - ESSENTIAL: You must explicitly mention the input numbers in the text. For example: "With our team of ${teamSizeNum}...", "Averaging ${formatCurrency(annualCostNum)} in cost per head...", "We are burning ${wasteHoursNum} hours/week on low-value tasks."
      
      Context: BCG 2025 report shows top 5% of AI-adopting firms see 5x revenue gains. 60% see minimal value.
      
      Partner Context (Winship Labs):
      - Specialty: Workforce Strategy & "No-Code" Agentic AI.
      - Value Prop: Strategy first, then build. Focus on talent amplification (doing more with same headcount) vs finding people to fire.
      - Speed: Executives don't want a 12-month dev cycle. We ship in weeks.
      
      Output Structure:
      [One sentence on market context regarding the widening gap in the ${industry} sector]
      
      ### Problem
      * [Mention the team size, specific busywork hours, and the resulting cost of inaction]
      
      ### Solution & Partnership
      * [Explain why Winship Labs is the partner: Strategic focus on 'Talent Amplification', not just dev. Rapid deployment of 'Executive Grade' assets.]
      * [How '${selectedOfferRow.name}' works: e.g. Audit -> Blueprint -> Build -> Train.]
      
      ### Requirements
      * [What is needed from the client? e.g. Access to SOPs, 2-3 hours of SME time per week for feedback/validation. No heavy IT lift.]
      
      ### ROI
      * [Projected return of ${formatCurrency(selectedOfferRow.annualTotalImpact || 0)} vs investment of ${formatCurrency(selectedOfferRow.price)}]
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate brief");
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        setAnalysis(generatedText);
      } else {
        throw new Error("No text returned");
      }
    } catch (error) {
      console.error(error);
      setGenerationError("Could not generate brief at this time. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    
    const textarea = document.createElement("textarea");
    textarea.value = analysis;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setGenerationError("Failed to copy to clipboard.");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20">
      <FontStyles />

      {/* --- HEADER SECTION --- */}
      <Header />

      {/* --- INPUTS SECTION (Cream Background) --- */}
      <section className="w-full max-w-2xl px-6 mb-16">
        <div className="space-y-8">
          
          {/* Input Group 1: Team Size */}
          <div className="space-y-3">
            <label className="flex items-center justify-between text-lg font-bold">
              <span>Number of people in scope</span>
              <Users className="w-5 h-5 opacity-40" />
            </label>
            <input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-none px-6 py-4 text-xl font-bold focus:outline-none focus:border-black transition-colors placeholder:text-slate-300"
              placeholder="e.g. 10"
              style={{ fontFamily: 'var(--font-body)' }}
            />
          </div>

          {/* Input Group 2: Salary */}
          <div className="space-y-3">
            <label className="flex items-center justify-between text-lg font-bold">
              <span>Avg. Employee Cost (Annual)</span>
              <DollarSign className="w-5 h-5 opacity-40" />
            </label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-bold opacity-30">$</span>
              <input
                type="number"
                min={0}
                value={annualCost}
                onChange={(e) => setAnnualCost(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-none pl-10 pr-6 py-4 text-xl font-bold focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <p className="text-sm opacity-60">Salary + benefits + overhead (ballpark is fine).</p>
          </div>

          {/* Input Group 3: Waste Slider */}
          <div className="space-y-4 pt-4">
            <div className="flex items-end justify-between">
              <label className="text-lg font-bold">Hours of busywork / week</label>
              <span className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>
                {wasteHours} <span className="text-base font-medium opacity-50">hrs</span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={wasteHours}
              onChange={(e) => setWasteHours(e.target.value)}
              className="w-full"
            />
            <p className="text-sm opacity-60">
              Reporting, copy-pasting, admin, hunting for files. Average is 8-15 hrs.
            </p>
          </div>
        </div>
      </section>

      {/* --- RESULTS SECTION (Mint Background) --- */}
      <section className="w-full py-16 px-6 relative" style={{ backgroundColor: COLORS.mint }}>
        
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Summary Stat */}
          <div className="text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">Current Reality</p>
            <div className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: 'var(--font-heading)' }}>
              You are burning <span className="underline decoration-4 underline-offset-4" style={{ textDecorationColor: COLORS.pink }}>{formatCurrency(totalWasteCostPerYear)}</span> / yr
            </div>
            <p className="text-lg opacity-70 max-w-xl mx-auto pt-2">
              That’s the value of the capacity currently trapped in admin work.
            </p>
          </div>

          {/* Cards Stack */}
          <div className="grid gap-6 md:grid-cols-3 items-start">
            {rows.map((row) => {
              const isSelected = row.key === selectedOfferKey;
              // Fade out unselected items if something is selected
              const isFaded = selectedOfferKey !== null && !isSelected;
              
              const opacityClass = row.isQualified 
                ? (isFaded ? "opacity-50" : "opacity-100") 
                : "opacity-40 grayscale pointer-events-none select-none";
                
              const Icon = row.guaranteeIcon;
              const isFractional = row.key === "fractional";

              return (
                <div 
                  key={row.key}
                  onClick={() => row.isQualified && setSelectedOfferKey(row.key)}
                  className={`group relative flex flex-col h-full bg-white border-2 border-transparent transition-all duration-300 shadow-sm cursor-pointer ${row.isQualified ? 'hover:shadow-md' : ''} ${isSelected ? 'border-black shadow-xl transform -translate-y-3' : ''} ${opacityClass}`}
                >
                  
                  {/* Minnow Overlay */}
                  {!row.isQualified && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-[1px] rounded-lg pointer-events-none">
                      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center gap-2">
                        <Lock className="w-6 h-6 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Scale Required
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top Color Bar */}
                  <div className="h-3 w-full" style={{ backgroundColor: row.color }}></div>

                  {/* Card Body - Uses Flex Grow to push footer down */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-extrabold leading-tight mb-2">{row.name}</h3>
                        <span className="inline-block px-2 py-1 text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 rounded-sm">
                          {row.badge}
                        </span>
                      </div>

                      {/* Description with Min Height for Alignment */}
                      <p className="text-sm opacity-70 leading-relaxed min-h-[90px]">
                        {row.description}
                      </p>

                      {/* Features Snippet */}
                      {row.features && (
                        <div className="flex gap-2">
                          {row.features.map(f => (
                            <span key={f} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Spacer to push Guarantee and Metrics to bottom */}
                    <div className="flex-grow"></div>

                    {/* Guarantee Badge */}
                    {row.guarantee && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-md border border-blue-100 mt-6 min-h-[75px]">
                        {Icon && <Icon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                        <p className="text-xs text-blue-800 font-medium leading-tight">
                          {row.guarantee}
                        </p>
                      </div>
                    )}

                    {/* Metrics Grid - Added More Padding */}
                    <div className="grid grid-cols-1 gap-4 py-6 border-t border-slate-100 mt-6">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide opacity-50 font-bold mb-1">Gross Annual Return</p>
                        <p className="text-3xl font-bold" style={{ color: COLORS.blue }}>
                          {formatCurrency(row.annualTotalImpact)}+
                        </p>
                        <p className="text-[10px] opacity-60 font-medium">* Methodology below</p>
                      </div>
                      
                      <div className="flex justify-between items-end pt-2">
                        <div>
                           <p className="text-xs uppercase tracking-wide opacity-50 font-bold mb-1">ROI</p>
                           <p className="text-xl font-bold">{row.roi.toFixed(1)}x</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs uppercase tracking-wide opacity-50 font-bold mb-1">Payback time</p>
                           <p className="text-xl font-bold">
                             {isFinite(row.paybackMonths) ? (
                                Math.round(row.paybackMonths) === 1 ? "1 month" : `${Math.round(row.paybackMonths)} months`
                             ) : "-"}
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Footer - Fixed Height for Alignment */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between h-24">
                    <span className="text-xs font-bold opacity-50 uppercase">Your Investment**</span>
                    <div className="text-right flex flex-col items-end justify-center h-full">
                      {isFractional ? (
                        <>
                          <span className="font-bold font-mono text-lg block">{formatCurrency(row.monthlyPrice!)} / mo</span>
                          <span className="text-xs font-mono text-slate-400 block mt-0.5">
                            {formatCurrency(row.price)} / yr
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-bold font-mono text-lg block">{formatCurrency(row.price)}</span>
                          {row.monthlyPrice && (
                            <span className="text-xs font-mono text-slate-400 block mt-0.5">
                              {formatCurrency(row.monthlyPrice)} / mo
                            </span>
                          )}
                        </>
                      )}
                      
                      {/* Price Anchor */}
                      {row.anchor && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
                          {row.anchor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selected Label Overlay */}
                  {isSelected && (
                    <div 
                      className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md"
                      style={{ backgroundColor: COLORS.black }}
                    >
                      Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* --- GEMINI FEATURE: EXECUTIVE BRIEF --- */}
          <div className="max-w-3xl mx-auto w-full pt-8 pb-4">
            <div className="bg-white border-2 border-slate-200 p-6 sm:p-8 rounded-lg shadow-sm space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: COLORS.yellow }} fill={COLORS.yellow} />
                  <h3 className="text-xl font-extrabold">
                    Bonus: AI Executive Brief
                  </h3>
                </div>
                <p className="text-sm opacity-60">
                  Generate a persuasive pitch for your CFO using these numbers.
                </p>

                {/* --- NEW INPUTS FORM --- */}
                {!analysis && (
                  <div className="grid gap-4 sm:grid-cols-3 bg-slate-50 p-4 rounded-md border border-slate-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> Industry
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Legal, SaaS..." 
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:border-black focus:ring-0"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                        <BarChart className="w-3 h-3" /> Current AI Maturity
                      </label>
                      <select 
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:border-black focus:ring-0 bg-white"
                        value={adoptionLevel}
                        onChange={(e) => setAdoptionLevel(e.target.value)}
                      >
                        <option value="Very Low">Very Low (Lagging)</option>
                        <option value="Low">Low (Curious)</option>
                        <option value="Medium">Medium (Experimenting)</option>
                        <option value="High">High (Scaling)</option>
                        <option value="Very High">Very High (Future-Built)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Interested In
                      </label>
                      <select 
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:border-black focus:ring-0 bg-white"
                        value={interestedTier}
                        onChange={(e) => setInterestedTier(e.target.value)}
                      >
                        {offers.map(offer => (
                          <option key={offer.key} value={offer.key}>{offer.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {!analysis && (
                  <button
                    onClick={generateBrief}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-md"
                    style={{ backgroundColor: COLORS.black }}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Drafting...
                      </>
                    ) : (
                      <>
                        Generate Custom Brief
                      </>
                    )}
                  </button>
                )}
              </div>

              {generationError && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded">
                  {generationError}
                </div>
              )}

              {analysis && (
                <div className="animate-fade-in space-y-4">
                  <div className="relative bg-slate-50 p-6 rounded-md border border-slate-100">
                    <MarkdownRenderer text={analysis} />
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors shadow-sm"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end">
                     <button
                        onClick={generateBrief}
                        className="text-xs font-bold underline opacity-50 hover:opacity-100"
                      >
                        Regenerate
                      </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Area */}
          <div className="bg-black text-white p-8 md:p-12 text-center space-y-6 rounded-none relative overflow-hidden">
             {/* Abstract shape */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
             
             <div className="relative z-10 max-w-2xl mx-auto space-y-6">
               <h3 className="text-2xl md:text-3xl font-bold text-white">
                 Ready to capture this value?
               </h3>
               <p className="text-lg opacity-80 font-light">
                 Stop guessing. Let's run a diagnostic on your team's workflow and find your highest-leverage opportunities in 48 hours.
               </p>
               <button 
                 className="animate-bounce-interval inline-flex items-center gap-2 px-8 py-4 text-black font-bold text-lg hover:scale-105 transition-transform"
                 style={{ backgroundColor: COLORS.yellow }}
               >
                 Book Your Diagnostic
                 <ArrowRight className="w-5 h-5" />
               </button>
               <p className="text-xs opacity-50 font-medium">
                 Limited to 5 audits per month.
               </p>
             </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs opacity-50 text-center max-w-3xl mx-auto space-y-6 pb-8">
            <div className="space-y-4">
              <p>
                <strong>* Methodology:</strong> We calculate the annual cost of the wasted hours based on your average employee cost. We then apply a conservative multiplier (1.5x for basic automation, 3.5x for strategic transformation) to account for the compounding value of reinvesting that time into high-leverage activities like sales, strategy, and innovation.
              </p>
              <p>
                <strong>** Your Investment:</strong> Pricing is estimated based on standard deployments. Final costs are subject to change based on specific project scope and requirements. Please reach out for a free consultation to confirm exact pricing for your needs.
              </p>
            </div>
            
            <p>
              <span className="font-bold">Assumptions:</span> This tool uses conservative benchmarks from public studies by firms like McKinsey, BCG, and Harvard Business Review on productivity and sales effectiveness. In plain English: when you free up focused time for knowledge workers and point it at higher value work, it typically produces several times its cost in business value. We encode that in the model as a modest revenue uplift on top of pure time savings, and a higher uplift for ongoing AI leadership, so the numbers stay defensible while still capturing upside.
            </p>
            <div className="pt-2 border-t border-slate-300/50">
              <p className="font-bold mb-1">Key Sources:</p>
              <ul className="space-y-1">
                <li>BCG (2025). <em>"Are You Generating Value from AI? The Widening Gap."</em></li>
                <li>McKinsey Global Institute (2023). <em>"The economic potential of generative AI."</em></li>
                <li>Harvard Business School (2023). <em>"Navigating the Jagged Technological Frontier."</em></li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
