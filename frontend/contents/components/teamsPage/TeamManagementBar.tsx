import { Button, Text } from "@mantine/core";
import { motion } from "framer-motion";
import SearchTeamMembers from "./SearchTeamMembers";

export default function TeamManagementBar() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center h-16 bg-white border-b border-gray-200 mt-24"
        >

            <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-row justify-between w-9/12"
            >
                <Text variant="gradient"
                    gradient={{ from: 'gray.8', to: 'gray.7', deg: 50 }}
                    ta="center"
                    fz="lg"
                    fw={600}
                >Your teams</Text>
               
            </motion.div>
        </motion.div>
    );
}