import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

interface MathBlockProps {
  title: string;
  children: React.ReactNode;
  formulas?: string[];
}

export const MathBlock: React.FC<MathBlockProps> = ({
  title,
  children,
  formulas = [],
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border-4 border-white/50 shadow-xl h-full flex flex-col justify-center">
      <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-[#D62412]">∫</span> {title}
      </h3>
      <div className="text-slate-600 font-medium leading-relaxed mb-6 space-y-2">
        {children}
      </div>

      {formulas.length > 0 && (
        <div className="bg-slate-100 rounded-xl p-4 border-2 border-slate-200 space-y-3">
          {formulas.map((formula, index) => (
            <div key={index} className="overflow-x-auto">
              <BlockMath math={formula} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
