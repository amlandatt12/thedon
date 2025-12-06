import React, { useState, useEffect } from 'react';
import { ArrowRight, Calculator, Calendar } from 'lucide-react';

// --- 1. Universal Unit Converter ---
const CONVERSION_RATES: Record<string, number> = {
    // Length (base: meter)
    'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'mi': 1609.34, 'yd': 0.9144, 'ft': 0.3048, 'in': 0.0254,
    // Weight (base: kg)
    'kg': 1, 'g': 0.001, 'mg': 0.000001, 'lb': 0.453592, 'oz': 0.0283495, 't': 1000,
    // Time (base: second)
    's': 1, 'min': 60, 'h': 3600, 'd': 86400, 'wk': 604800, 'mo': 2628000, 'y': 31536000,
    // Digital (base: byte)
    'B': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776,
    // Speed
    'm/s': 1, 'km/h': 3.6, 'mph': 2.23694, 'ft/s': 3.28084, 'kn': 1.94384,
    // Area
    'sqm': 1, 'sqkm': 0.000001, 'sqft': 10.7639, 'sqyd': 1.19599, 'acre': 0.000247105, 'ha': 0.0001,
};

const CATEGORIES: Record<string, string[]> = {
    'length': ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'],
    'weight': ['kg', 'g', 'mg', 'lb', 'oz', 't'],
    'time': ['s', 'min', 'h', 'd', 'wk', 'mo', 'y'],
    'digital': ['B', 'KB', 'MB', 'GB', 'TB'],
    'speed': ['m/s', 'km/h', 'mph', 'ft/s', 'kn'],
    'area': ['sqm', 'sqkm', 'sqft', 'sqyd', 'acre', 'ha'],
};

export const UnitConverter: React.FC<{ defaultCategory?: string }> = ({ defaultCategory = 'length' }) => {
    const [category, setCategory] = useState(defaultCategory);
    const [amount, setAmount] = useState<number>(1);
    const [from, setFrom] = useState(CATEGORIES[defaultCategory]?.[0] || 'm');
    const [to, setTo] = useState(CATEGORIES[defaultCategory]?.[1] || 'km');

    // Handle category change update units
    useEffect(() => {
        if (CATEGORIES[category]) {
            setFrom(CATEGORIES[category][0]);
            setTo(CATEGORIES[category][1]);
        }
    }, [category]);

    const convert = () => {
        if (category === 'temperature') {
            // Special logic for temp
            if (from === 'C' && to === 'F') return (amount * 9 / 5) + 32;
            if (from === 'F' && to === 'C') return (amount - 32) * 5 / 9;
            return amount;
        }

        const base = amount * (CONVERSION_RATES[from] || 1);
        const result = base / (CONVERSION_RATES[to] || 1);
        return result;
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent capitalize">
                    {category} Converter
                </h2>
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none outline-none"
                >
                    {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center flex-1">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <label className="block text-sm text-slate-500 mb-2">From</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(parseFloat(e.target.value))}
                        className="w-full text-4xl font-bold bg-transparent outline-none mb-4 border-b border-slate-200 dark:border-slate-700"
                    />
                    <select
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                        {CATEGORIES[category]?.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>

                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <ArrowRight size={32} />
                    </div>
                </div>

                <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl border border-primary-100 dark:border-primary-800">
                    <label className="block text-sm text-primary-600 dark:text-primary-400 mb-2">To</label>
                    <div className="w-full text-4xl font-bold text-primary-700 dark:text-primary-300 mb-4 overflow-hidden text-ellipsis">
                        {convert().toLocaleString(undefined, { maximumFractionDigits: 6 })}
                    </div>
                    <select
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg border border-primary-200 dark:border-primary-700/50"
                    >
                        {CATEGORIES[category]?.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

// --- 2. Date & Age Calculator ---
export const DateCalculator: React.FC<{ type?: 'age' | 'diff' }> = ({ type = 'age' }) => {
    const [d1, setD1] = useState(new Date().toISOString().split('T')[0]);
    const [d2, setD2] = useState(new Date().toISOString().split('T')[0]);

    const calculate = () => {
        const start = new Date(d1);
        const end = type === 'age' ? new Date() : new Date(d2);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = Math.floor((diffDays % 365) % 30);
        return { years, months, days, totalDays: diffDays };
    };

    const res = calculate();

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-primary-500" />
                {type === 'age' ? 'Age Calculator' : 'Date Difference'}
            </h2>
            <div className="grid gap-6">
                <div className="flex flex-col gap-2">
                    <label>Start Date {type === 'age' && '(Birthday)'}</label>
                    <input type="date" value={d1} onChange={e => setD1(e.target.value)} className="p-3 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700" />
                </div>
                {type === 'diff' && (
                    <div className="flex flex-col gap-2">
                        <label>End Date</label>
                        <input type="date" value={d2} onChange={e => setD2(e.target.value)} className="p-3 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700" />
                    </div>
                )}

                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-sm text-slate-500 uppercase tracking-wide mb-2">Result</div>
                    <div className="text-4xl font-bold text-primary-600 mb-2">
                        {res.years}y {res.months}m {res.days}d
                    </div>
                    <div className="text-slate-500">
                        or {res.totalDays.toLocaleString()} total days
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 3. Universal Math Calculator (Financial, Health, Basic) ---
type CalcMode = 'percentage' | 'loan' | 'compound' | 'bmi' | 'discount' | 'margin';

// Configurations for each calculator type
const CALC_CONFIG: Record<CalcMode, {
    title: string;
    inputs: { id: string; label: string; def: number; prefix?: string; suffix?: string }[];
    formula: (vals: Record<string, number>) => { result: number; label: string; detail?: string };
}> = {
    percentage: {
        title: 'Percentage Calculator',
        inputs: [
            { id: 'total', label: 'Total Value', def: 100 },
            { id: 'percent', label: 'Percentage', def: 20, suffix: '%' }
        ],
        formula: (v) => ({ result: (v.total * v.percent) / 100, label: 'Result' })
    },
    loan: {
        title: 'Loan / Mortgage Calculator',
        inputs: [
            { id: 'amount', label: 'Loan Amount', def: 100000, prefix: '$' },
            { id: 'rate', label: 'Interest Rate', def: 5, suffix: '%' },
            { id: 'years', label: 'Loan Term (Years)', def: 30 }
        ],
        formula: (v) => {
            const r = v.rate / 100 / 12;
            const n = v.years * 12;
            const emi = (v.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const total = emi * n;
            return {
                result: emi,
                label: 'Monthly Payment',
                detail: `Total Payment: $${total.toFixed(2)} (Interest: $${(total - v.amount).toFixed(2)})`
            };
        }
    },
    compound: {
        title: 'Compound Interest Calculator',
        inputs: [
            { id: 'principal', label: 'Principal Amount', def: 1000, prefix: '$' },
            { id: 'rate', label: 'Annual Rate', def: 5, suffix: '%' },
            { id: 'years', label: 'Time Period (Years)', def: 10 },
            { id: 'comp', label: 'Compounding (per yr)', def: 12 } // 12=monthly
        ],
        formula: (v) => {
            const amt = v.principal * Math.pow((1 + (v.rate / 100) / v.comp), v.comp * v.years);
            return {
                result: amt,
                label: 'Future Value',
                detail: `Interest Earned: $${(amt - v.principal).toFixed(2)}`
            };
        }
    },
    bmi: {
        title: 'BMI Calculator',
        inputs: [
            { id: 'weight', label: 'Weight (kg)', def: 70 },
            { id: 'height', label: 'Height (cm)', def: 175 }
        ],
        formula: (v) => {
            const h = v.height / 100;
            const bmi = v.weight / (h * h);
            let cat = 'Normal';
            if (bmi < 18.5) cat = 'Underweight';
            else if (bmi >= 25 && bmi < 29.9) cat = 'Overweight';
            else if (bmi >= 30) cat = 'Obese';
            return { result: bmi, label: 'BMI Score', detail: `Category: ${cat}` };
        }
    },
    discount: {
        title: 'Discount Calculator',
        inputs: [
            { id: 'price', label: 'Original Price', def: 100, prefix: '$' },
            { id: 'off', label: 'Discount', def: 20, suffix: '%' }
        ],
        formula: (v) => {
            const save = (v.price * v.off) / 100;
            return { result: v.price - save, label: 'Final Price', detail: `You save: $${save.toFixed(2)}` };
        }
    },
    margin: {
        title: 'Profit Margin Calculator',
        inputs: [
            { id: 'cost', label: 'Cost Price', def: 50, prefix: '$' },
            { id: 'sale', label: 'Sale Price', def: 100, prefix: '$' }
        ],
        formula: (v) => {
            const profit = v.sale - v.cost;
            const margin = (profit / v.sale) * 100;
            return { result: margin, label: 'Gross Margin (%)', detail: `Profit: $${profit.toFixed(2)}` };
        }
    }
};

export const MathCalculator: React.FC<{ type?: CalcMode }> = ({ type = 'percentage' }) => {
    const config = CALC_CONFIG[type] || CALC_CONFIG.percentage;
    const [values, setValues] = useState<Record<string, number>>(() => {
        const init: any = {};
        config.inputs.forEach(i => init[i.id] = i.def);
        return init;
    });

    const handleChange = (id: string, val: string) => {
        setValues(prev => ({ ...prev, [id]: parseFloat(val) || 0 }));
    };

    let output = { result: 0, label: 'Result', detail: '' };
    try {
        output = config.formula(values);
    } catch (e) { }

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calculator className="text-primary-500" /> {config.title}</h2>

            <div className="grid gap-4 mb-8">
                {config.inputs.map(input => (
                    <div key={input.id} className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-500">{input.label}</label>
                        <div className="relative">
                            {input.prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{input.prefix}</span>}
                            <input
                                type="number"
                                value={values[input.id]}
                                onChange={e => handleChange(input.id, e.target.value)}
                                className={`w-full p-3 rounded-xl border bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500 ${input.prefix ? 'pl-8' : ''} ${input.suffix ? 'pr-8' : ''}`}
                            />
                            {input.suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{input.suffix}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 bg-slate-900 text-white rounded-2xl shadow-xl text-center">
                <div className="text-slate-400 text-sm uppercase tracking-wider mb-2">{output.label}</div>
                <div className="text-5xl font-bold mb-2 break-all">
                    {output.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                {output.detail && <div className="text-emerald-400 text-sm font-medium bg-emerald-400/10 inline-block px-3 py-1 rounded-full">{output.detail}</div>}
            </div>
        </div>
    );
};