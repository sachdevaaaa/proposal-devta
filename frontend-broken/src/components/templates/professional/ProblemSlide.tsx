import SlideWrapper from "../../ui/SlideWrapper";

interface ProblemSlideProps {
  problems: string[];
}

const ProblemSlide: React.FC<ProblemSlideProps> = ({ problems }) => {
  return (
    <SlideWrapper title="Problem Statement">
      <ul className="space-y-3 list-disc pl-5">
        {problems.map((p, i) => (
          <li key={i} className="text-gray-700">
            {p}
          </li>
        ))}
      </ul>
    </SlideWrapper>
  );
};

export default ProblemSlide;
