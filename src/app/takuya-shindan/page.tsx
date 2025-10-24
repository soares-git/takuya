"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Answer = {
  q1?: string;
  q2?: number;
  q3?: number;
};

const nf = new Intl.NumberFormat("ja-JP");

export default function ChatLP() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const timersRef = useRef<number[]>([]);

  const pushTimer = (id: number) => timersRef.current.push(id);
  useEffect(() => () => timersRef.current.forEach((id) => clearTimeout(id)), []);

  useEffect(() => {
    if (step === 0) {
      const id = window.setTimeout(() => setStep((s) => s + 1), 1200);
      pushTimer(id);
    }
  }, [step]);

  const next = (delay = 300) => {
    const id = window.setTimeout(() => setStep((s) => s + 1), delay);
    pushTimer(id);
  };

  const handleRadioSelect = (question: keyof Answer, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    next(400);
  };

  const handleNumberInput = (question: keyof Answer, value: string) => {
    const clean = value.replace(/[^0-9]/g, "");
    setAnswers((prev) => ({
      ...prev,
      [question]: clean === "" ? undefined : Number(clean),
    }));
  };

  const canProceedStep2 = typeof answers.q2 === "number" && answers.q2 >= 0;
  const canProceedStep3 = typeof answers.q3 === "number" && answers.q3 >= 0;

  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none" }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Hero: キャッチコピー画像（PNG） */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <img
            draggable={false}
            src="/hero-catch.png"
            alt="キャッチコピー"
            loading="eager"
            style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", pointerEvents: "none" }}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* ヘッダー（進行状況） */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">たくやの投資チャンネル</span>
          <span>
            {Math.min(step, 4) < 4 ? (
              <>
                質問進行: <b>{Math.min(Math.max(step, 1), 3)}</b>/3
              </>
            ) : (
              <>結果</>
            )}
          </span>
        </div>

        {/* Step 0: 挨拶 */}
        <ChatMessage type="operator" delay={0}>
          <p className="text-gray-800">
            こんにちは！たくやの投資チャンネルです。
            <br />
            いくつか質問させてください！
          </p>
        </ChatMessage>

        {/* Step 1: 質問1 */}
        {step >= 1 && (
          <ChatMessage type="operator" delay={0.4}>
            <p className="text-gray-800">残り3問) メインで取引している投資先を教えてください。</p>
          </ChatMessage>
        )}

        {step >= 1 && (
          <ChatMessage type="user" delay={0.7}>
            {step === 1 ? (
              <div className="space-y-3" role="radiogroup" aria-label="投資先">
                {["インデックス投資", "積立投資", "個別株", "不動産", "債券", "FX", "仮想通貨", "まだ始めていない"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleRadioSelect("q1", option)}
                    className="w-full bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-600 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    role="radio"
                    aria-checked={answers.q1 === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-800 font-semibold">{answers.q1}</p>
            )}
          </ChatMessage>
        )}

        {/* Step 2 */}
        {step >= 2 && (
          <ChatMessage type="operator" delay={0.4}>
            <p className="text-gray-800">残り2問) 現在の資産額を教えてください。</p>
          </ChatMessage>
        )}

        {step >= 2 && (
          <ChatMessage type="user" delay={0.7}>
            {step === 2 ? (
              <NumberQuestion
                label="現在の資産額"
                suffix="万円"
                value={answers.q2}
                onChange={(v) => handleNumberInput("q2", v)}
                onSubmit={() => canProceedStep2 && next()}
                helper="半角数字のみ。0以上の整数で入力してください。"
                submitText="次へ"
                disabled={!canProceedStep2}
              />
            ) : (
              <p className="text-gray-800 font-semibold">{nf.format(answers.q2 ?? 0)}万円</p>
            )}
          </ChatMessage>
        )}

        {/* Step 3 */}
        {step >= 3 && (
          <ChatMessage type="operator" delay={0.4}>
            <p className="text-gray-800">残り1問) 目標の資産額を教えてください。</p>
          </ChatMessage>
        )}

        {step >= 3 && (
          <ChatMessage type="user" delay={0.7}>
            {step === 3 ? (
              <NumberQuestion
                label="目標の資産額"
                suffix="万円"
                value={answers.q3}
                onChange={(v) => handleNumberInput("q3", v)}
                onSubmit={() => canProceedStep3 && next()}
                helper="半角数字のみ。0以上の整数で入力してください。"
                submitText="結果を見る"
                disabled={!canProceedStep3}
              />
            ) : (
              <p className="text-gray-800 font-semibold">{nf.format(answers.q3 ?? 0)}万円</p>
            )}
          </ChatMessage>
        )}

        {/* Step 4 */}
        {step >= 4 && (
          <>
            <ChatMessage type="operator" delay={0.4}>
              <p className="text-gray-800">いまの設計だと「時間損失」が生まれる可能性があります。</p>
            </ChatMessage>

            <ChatMessage type="operator" delay={0.8}>
              <p className="text-gray-800">
                守りと攻めのバランスを整える&quot;ハイブリッド戦略&quot;を学ぶことで、
                同じ元手でも、10年後の結果を大きく変えることができます。
              </p>
            </ChatMessage>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="space-y-8">
              {/* 画像カード 2枚（四方シャドウ） */}
              <div className="flex flex-col items-center gap-5">
                <div className="bg-white p-5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] w-11/12">
                  <img
                    draggable={false}
                    src="/case1.png"
                    alt="グラフ・成果イメージ"
                    style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", pointerEvents: "none" }}
                    className="w-full h-auto rounded-xl object-contain"
                  />
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] w-11/12">
                  <img
                    draggable={false}
                    src="/case2.png"
                    alt="実績・サンプルデータ"
                    style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", pointerEvents: "none" }}
                    className="w-full h-auto rounded-xl object-contain"
                  />
                </div>
              </div>

              {/* CTA（改行はspanで安全に） */}
              <a
                href="https://utage-system.com/line/open/3mD1cVatRxfv"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold text-3xl md:text-4xl py-9 md:py-10 px-10 md:px-12 rounded-3xl text-center transition-all shadow-2xl"
              >
                <span className="block">&quot;ハイブリッド戦略&quot;を</span>
                <span className="block">LINEで確認する▶</span>
              </a>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

// =============== Components ===============
function ChatMessage({ type, delay = 0, children }: { type: "operator" | "user"; delay?: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`flex ${type === "user" ? "justify-end" : "justify-start"} gap-3`}
      role="region"
      aria-live="polite"
    >
      {type === "operator" && (
        <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-blue-100">
          <img draggable={false} src="/operator-icon.png" alt="オペレーター" style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", pointerEvents: "none" }} className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`max-w-md px-5 py-4 rounded-2xl ${type === "operator" ? "bg-blue-50 rounded-tl-sm" : "bg-gray-200 rounded-tr-sm"}`}>{children}</div>
    </motion.div>
  );
}

function NumberQuestion({ label, suffix, value, onChange, onSubmit, helper, submitText, disabled }: { label: string; suffix?: string; value?: number; onChange: (value: string) => void; onSubmit: () => void; helper?: string; submitText?: string; disabled?: boolean }) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <div className="relative mt-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value ?? ""}
            placeholder="例：1000"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !disabled) onSubmit();
            }}
            className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          />
          {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">{suffix}</span>}
        </div>
      </label>
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
      <button onClick={onSubmit} disabled={disabled} className="w-full bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
        {submitText ?? "次へ"}
      </button>
    </div>
  );
}
