import { motion } from "framer-motion";
import { ScrollArea } from '@mantine/core';
import TeamCard from "./TeamCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,  // Reduced from 0.3
      ease: "easeOut",
      duration: 0.5
    }
  }
};

const item = {
  hidden: { y: 15, opacity: 0 },  // Reduced y offset
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function TeamsGrid({teams}: {teams: any}) {
  return (
    <div className="">
      <div className="flex justify-center">
        <ScrollArea style={{ height: '24rem', width: '66.6666%' }} className="-mt-2 mb-4">
          <motion.div 
            className="grid grid-cols-4 "
            variants={container}
            initial="hidden"
            animate="show"
          >
            {teams?.teams?.map((team: any, index: number) => (
              <motion.div key={index} variants={item}>
                <TeamCard team={team} />
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </div>
    </div>
  );
}