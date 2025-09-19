import SlideWrapper from "../../ui/SlideWrapper";

interface SolutionSlideProps {
  solutions: string[];
}

const SolutionSlide: React.FC<SolutionSlideProps> = ({ solutions }) => {
  return (
    <SlideWrapper title="Proposed Solution">
      <ul className="space-y-3 list-disc pl-5">
        {solutions.map((s, i) => (
          <li key={i} className="text-gray-700">
            {s}
          </li>
        ))}
      </ul>
    </SlideWrapper>
  );
};

export default SolutionSlide;
