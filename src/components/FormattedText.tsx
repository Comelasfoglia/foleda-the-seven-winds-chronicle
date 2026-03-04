import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

/** Renders text with **bold** markers and \n\n paragraph breaks */
const FormattedText = ({ text, className = "" }: FormattedTextProps) => {
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, pIdx) => (
        <p key={pIdx} className={pIdx > 0 ? "mt-4" : ""}>
          {paragraph.split(/(\*\*[^*]+\*\*)/).map((segment, sIdx) => {
            if (segment.startsWith("**") && segment.endsWith("**")) {
              return (
                <strong key={sIdx} className="font-semibold text-foreground">
                  {segment.slice(2, -2)}
                </strong>
              );
            }
            return <React.Fragment key={sIdx}>{segment}</React.Fragment>;
          })}
        </p>
      ))}
    </div>
  );
};

export default FormattedText;
