import React, { useEffect } from "react";
import { motion } from "framer-motion";
import PeopleManagementBar from "@/contents/components/teamsPage/PeopleManagementBar";
import TeamMembersGrid from "@/contents/components/teamsPage/TeamMembersGrid";
import TeamManagementBar from "@/contents/components/teamsPage/TeamManagementBar";
import TeamsGrid from "@/contents/components/teamsPage/TeamsGrid";
import FooterEMS from "@/contents/components/footer/Footer";
import { TeamsServices } from "@/services/teams/teams";
import Header from "@/contents/components/header/Header";
import { ScrollArea } from "@mantine/core";

export default function DashboardPage() {
  const [peopleData, setPeopleData] = React.useState([]);
  const [teamsData, setTeamsData] = React.useState([]);

  // Fetch teams initially
  useEffect(() => {
    fetchTeams();
  }, []);

  // Fetch colleagues initially
  useEffect(() => {
    fetchColleagues();
  }, []);

  // 1) Define fetch functions
  const fetchTeams = () => {
    TeamsServices.getTeams()
      .then((response) => {
        setTeamsData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchColleagues = () => {
    TeamsServices.getUserColleagues()
      .then((response) => {
        setPeopleData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 2) UseEffect to LISTEN for TEAM_CREATED/TEAM_UPDATED events
  useEffect(() => {
    function handleTeamCreated() {
      // Re-fetch teams
      console.log("TEAM_CREATED/TEAM_UPDATED event received. Re-fetching teams...");
      fetchTeams();
    }

      window.addEventListener("TEAM_CREATED", handleTeamCreated);
      window.addEventListener("TEAM_UPDATED", handleTeamCreated);
    return () => {
      // Clean up listener on unmount
        window.removeEventListener("TEAM_CREATED", handleTeamCreated);
        window.removeEventListener("TEAM_UPDATED", handleTeamCreated);
    };
  }, []);

  return (
    <div>
        <Header />
        <ScrollArea className="flex-1 h-[calc(100vh-52px)] overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-full"
          >

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <PeopleManagementBar teams={teamsData} people={peopleData}/>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <TeamMembersGrid colleagues={peopleData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <TeamManagementBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <TeamsGrid teams={teamsData} />
            </motion.div>
          </motion.div>
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <FooterEMS />
        </motion.div>
      </ScrollArea>
    </div>
  );
}
