import { useContext, useState } from "react";
import { Button, Text, TextInput, Textarea, Select, MultiSelect } from "@mantine/core";
import { motion } from "framer-motion";
import SearchTeamMembers from "./SearchTeamMembers";
import { TeamsServices } from "@/services/teams/teams";
import { toInteger } from "lodash";
import { ProfileContext } from "@/contexts/ProfileContext";

export default function PeopleManagementBar({ teams, people }: { teams: any; people: any }) {
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);

  const openCreateTeamModal = () => setShowCreateTeamModal(true);
  const closeCreateTeamModal = () => setShowCreateTeamModal(false);

  const openAddPeopleModal = () => setShowAddPeopleModal(true);
  const closeAddPeopleModal = () => setShowAddPeopleModal(false);

  const { profile } = useContext(ProfileContext)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center h-16 bg-white border-b border-gray-200"
      >
        <motion.div className="flex flex-row justify-between w-9/12 pt-6 pb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Text
              variant="gradient"
              gradient={{ from: "indigo", to: "green", deg: 50 }}
              ta="center"
              fz="xl"
              fw={700}
            >
              Team Management
            </Text>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
           {profile?.type == 'manager' &&  <><motion.div whileHover={{ scale: 1.02 }} className="inline-block" key={profile}>
              <Button variant="light" color="blue" onClick={openCreateTeamModal}>
                Create Team
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="inline-block ml-2">
              <Button color="blue.8" onClick={openAddPeopleModal}>
                Add People
              </Button>
            </motion.div></>}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-row justify-between w-9/12 pt-6"
        >
          <Text
            variant="gradient"
            gradient={{ from: "gray.8", to: "gray.7", deg: 50 }}
            ta="center"
            fz="lg"
            fw={600}
          >
            You work with
          </Text>
          <div>
          </div>
        </motion.div>
      </motion.div>

      {/* Conditionally render the modals */}
      {showCreateTeamModal && <CreateTeamModal onClose={closeCreateTeamModal} />}
      {showAddPeopleModal && (
        <AddPeopleModal
          onClose={closeAddPeopleModal}
          teams={teams}
          people={people}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------
   CreateTeamModal Component
   ------------------------------------------------------------- */
function CreateTeamModal({ onClose }: { onClose: () => void }) {
  const [teamName, setTeamName] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");

  // Submit handler - calls backend to create a new team
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      TeamsServices.createTeam({
        name: teamName,
        department: department,
        description: description,
      })
        .then((response) => {
          console.log("Team created:", response);

          // DISPATCH EVENT to notify team creation
          const event = new Event("TEAM_CREATED");
          window.dispatchEvent(event);
        })
        .catch((error) => {
          console.log(error);
        });

      onClose();
    } catch (err) {
      console.error("Error creating team:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        onClick={(e: any) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex w-10/12 md:w-8/12 lg:w-6/12 bg-white rounded-lg overflow-hidden shadow-lg"
      >
        {/* LEFT SECTION WITH INLINE GRADIENT & IMAGE */}
        <div
          className="hidden md:flex flex-col justify-center items-center w-1/2 p-6"
          style={{
            background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(167, 195, 255) 300%)",
          }}
        >
          <img
            src="create_teams_illustration.png"
            alt="Teams Illustration"
            className="max-w-full h-auto"
          />
        </div>

        {/* RIGHT SECTION WITH FORM */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Team</h2>
          <Text c="dimmed" className="mb-4">
            Bring everyone together with one team you can @mention, filter, and assign work to.
          </Text>
          <form onSubmit={handleCreateTeam}>
            <label className="block mb-2 text-gray-700">Team Name</label>
            <TextInput
              value={teamName}
              onChange={(e) => setTeamName(e.currentTarget.value)}
              placeholder="e.g. Marketing Team"
              className="mb-4"
              required
            />

            <label className="block mb-2 text-gray-700">Department</label>
            <TextInput
              value={department}
              onChange={(e) => setDepartment(e.currentTarget.value)}
              placeholder="e.g. Marketing"
              className="mb-4"
            />

            <label className="block mb-2 text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              placeholder="Brief description of the team"
              autosize
              minRows={2}
              className="mb-4"
            />

            <div className="flex items-center space-x-2 mt-6">
              <Button type="submit" color="blue">
                Create
              </Button>
              <Button variant="outline" color="gray" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------
   AddPeopleModal Component
   ------------------------------------------------------------- */
function AddPeopleModal({
  onClose,
  teams,
  people,
}: {
  onClose: () => void;
  teams: any[];
  people: any[];
}) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleAddPeople = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Example payload for adding people to a team
      // You can update to match your backend endpoint
      const payload = {
        id: selectedTeam, // or parseInt if you store IDs as numbers
        members: selectedMembers.map((member: string) => toInteger(member)), // an array of user IDs or user email, etc.
      };

      TeamsServices.updateTeam(payload)
        .then((res) => {
          console.log("Added people to team:", res);

          // DISPATCH EVENT to notify team update
          const event = new Event("TEAM_UPDATED");
          window.dispatchEvent(event);
        })
        .catch((error) => {
          console.log("Error adding people:", error);
        });

      onClose();
    } catch (err) {
      console.error("Error adding people:", err);
    }
  };

  // Convert `teams` & `people` to options for Select / MultiSelect
  const teamOptions = teams?.map((t: any) => ({
    label: t.name,
    value: String(t.id), // ensure string
  }));

  const peopleOptions = people.map((p) => ({
    label: p.name,
    value: String(p.id), 
  }));

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        onClick={(e: any) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex w-10/12 md:w-8/12 lg:w-6/12 bg-white rounded-lg overflow-hidden shadow-lg"
      >
        {/* LEFT SECTION */}
        <div
          className="hidden md:flex flex-col justify-center items-center w-1/2 p-6"
          style={{
            background: "linear-gradient(135deg, rgb(255,255,255) 0%, rgb(255,229,167) 300%)",
          }}
        >
          <img
            src="add_people_illustation.png"
            alt="Add People Illustration"
            className="max-w-full h-auto w-5/6"
          />
        </div>

        {/* RIGHT SECTION WITH FORM */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Add people to your team</h2>
          <Text c="dimmed" className="mb-4">
            Select the appropriate team and specify which members you wish to include.
          </Text>
          <form onSubmit={handleAddPeople}>
            <label className="block mb-2 text-gray-700">Select team</label>
            <Select
              data={teamOptions}
              placeholder="Pick a team"
              value={selectedTeam}
              onChange={setSelectedTeam}
              searchable
              nothingFound="No teams found"
              className="mb-4"
              required
            />

            <label className="block mb-2 text-gray-700">Select members</label>
            <MultiSelect
              data={peopleOptions}
              placeholder="Choose members..."
              value={selectedMembers}
              onChange={(values) => {
                setSelectedMembers(values);
                console.log("Selected members:", values); 
              }}
              searchable
              nothingFound="No people found"
              className="mb-4"
            />

            <div className="flex items-center space-x-2 mt-6">
              <Button type="submit" color="blue">
                Add to Team
              </Button>
              <Button variant="outline" color="gray" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
