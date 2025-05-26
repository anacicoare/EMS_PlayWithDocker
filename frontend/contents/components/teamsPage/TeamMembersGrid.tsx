import { motion } from "framer-motion";
import TeamMemberCard from "./TeamMemberCard";
import { ScrollArea } from "@mantine/core";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      ease: "easeOut",
      duration: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function TeamGrid({ colleagues }: { colleagues: any[] }) {
  // Create a string key that changes if the array length changes
  // (You could also hash the entire array if you want to re-run on every data change.)
  const containerKey = String(colleagues?.length ?? 0);

  return (
    <div className="mt-24">
      <div className="flex justify-center">
        <ScrollArea style={{ height: "18rem", width: "66.66666%" }}>
          <motion.div
            key={containerKey}
            className="grid grid-cols-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {colleagues?.map((colleague, index) => (
              <motion.div key={index} variants={item}>
                <TeamMemberCard member={colleague} />
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </div>
    </div>
  );
}
