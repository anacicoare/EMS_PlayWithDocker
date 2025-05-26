import TaskStatusBar from "./TaskStatusBar";
import PersonAccordion from "./PersonAccordion";
import { useContext, useEffect, useState } from "react";
import { TeamsServices } from "@/services/teams/teams";
import { ProfileContext } from "@/contexts/ProfileContext";
import { emitter } from "@/events/statusEmitter";
import { Button, Container, Drawer, Group } from "@mantine/core";
import { SpotlightProvider, spotlight } from '@mantine/spotlight';
import type { SpotlightAction } from '@mantine/spotlight';
import { IconDashboard, IconFileText, IconHome, IconSearch } from "@tabler/icons-react";
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { useDisclosure } from "@mantine/hooks";
import { TasksServices } from "@/services/tasks/tasks";
import type { Handler } from 'mitt';

interface TeamMember {
    id: string;
    name: string;
    tasks: any[];
}

interface Team {
    id: string;
    name: string;
    description: string;
    owner: string;
    members: TeamMember[];
}

interface TeamsResponse {
    data: {
        teams: Team[];
    };
}

interface TaskData {
    id: string;
    team: string;
    assigned_to: string;
    summary: string;
    start_date: string;
    end_date: string;
    original_estimate: number;
    estimation: number;
}

export default function TeamPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const { profile } = useContext(ProfileContext);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [actions, setActions] = useState<SpotlightAction[]>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [ganttTasks, setGanttTasks] = useState<Task[]>([]);
    const [tasks, setTasks] = useState<TaskData[]>([]);

    // Function to merge tasks into teams
    const mergeTasksIntoTeams = (teamsData: Team[], tasksData: TaskData[]) => {
        return teamsData.map((team) => ({
            ...team,
            members: team.members.map((member) => ({
                ...member,
                tasks: tasksData.filter((task) => 
                    task.assigned_to === member.id && task.team === team.id
                )
            }))
        }));
    };

    // Function to create Gantt tasks from team data
    const createGanttTasks = (teamData: Team) => {
        if (!teamData?.members) return [];
        
        return teamData.members.reduce((acc: Task[], member) => {
            return acc.concat(member.tasks.map((task) => ({
                id: task.id.toString(),
                name: task.summary,
                start: new Date(task.start_date),
                end: new Date(task.end_date),
                progress: task.original_estimate > 0 
                    ? Math.max(0, Math.min(100, (task.original_estimate - task.estimation) / task.original_estimate * 100))
                    : 0,
                type: "task" as const
            })));
        }, []);
    };

    // Load teams and tasks data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [teamsRes, tasksRes] = await Promise.all([
                    TeamsServices.getTeams(),
                    TasksServices.getTasks()
                ]);

                const tasksData = tasksRes?.data || [];
                setTasks(tasksData);

                const userTeams = (teamsRes as TeamsResponse).data.teams.filter((team: Team) =>
                    team?.owner === profile.name ||
                    team.members.some((member: TeamMember) => member.name === profile.name)
                );

                // Merge tasks into teams
                const teamsWithTasks = mergeTasksIntoTeams(userTeams, tasksData);
                setTeams(teamsWithTasks);
                
                const firstTeam = teamsWithTasks[0];
                setSelectedTeam(firstTeam);
                
                // Create Gantt tasks for the first team
                setGanttTasks(createGanttTasks(firstTeam));

                // Create spotlight actions
                setActions(teamsWithTasks.map((team) => ({
                    title: team.name,
                    description: team.description,
                    onTrigger: () => {
                        setSelectedTeam(team);
                        setGanttTasks(createGanttTasks(team));
                    },
                    icon: <IconDashboard size="1.2rem" />,
                })));

            } catch (err) {
                console.log("Error loading data:", err);
            }
        };

        if (profile?.name) {
            loadData();
        }
    }, [profile]);

    useEffect(() => {
        const handleTaskCreated: Handler<TaskData> = (newTask) => {
            if (!newTask) {
                console.warn("taskCreated event received undefined newTask");
                return;
            }

            // Update tasks array
            setTasks((prevTasks: TaskData[]) => [...prevTasks, newTask]);

            // Update teams with the new task
            setTeams((prevTeams: Team[]) => {
                const updatedTeams = prevTeams.map((team: Team) => {
                    if (team.id === newTask.team) {
                        return {
                            ...team,
                            members: team.members.map((member: TeamMember) => {
                                if (member.id === newTask.assigned_to) {
                                    return { ...member, tasks: [...member.tasks, newTask] };
                                }
                                return member;
                            })
                        };
                    }
                    return team;
                });
                return updatedTeams;
            });

            // Update selected team if it matches
            setSelectedTeam((prevTeam: Team | null) => {
                if (!prevTeam || prevTeam.id !== newTask.team) return prevTeam;
                
                const updatedMembers = prevTeam.members.map((member: TeamMember) => {
                    if (member.id === newTask.assigned_to) {
                        return { ...member, tasks: [...member.tasks, newTask] };
                    }
                    return member;
                });
                
                const updatedTeam = { ...prevTeam, members: updatedMembers };
                
                // Update Gantt tasks as well
                setGanttTasks(createGanttTasks(updatedTeam));
                
                return updatedTeam;
            });
        };

        emitter.on("taskCreated", handleTaskCreated);
        return () => {
            emitter.off("taskCreated", handleTaskCreated);
        };
    }, []);

    function SpotlightControl() {
        return (
            <div
                className="fixed top-2 left-[300px] z-50 flex"
            >
                <Button onClick={() => spotlight.open()} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
                    Change team
                </Button>
                <Button onClick={open} className="ml-4" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>View Gantt chart</Button>
            </div>
        );
    }

    return (
        <div>
            <Drawer
                opened={opened}
                onClose={close}
                title=""
                overlayProps={{ opacity: 0.5, blur: 4 }}
                size="100%"
            >
                <h2 className="text-slate-700 mt-0">Project progress for {selectedTeam?.name}</h2>
                <Gantt
                    tasks={ganttTasks}
                    rowHeight={32}
                />
            </Drawer>
            <SpotlightProvider
                actions={actions}
                searchIcon={<IconSearch size="1.2rem" />}
                searchPlaceholder="Search..."
                shortcut="mod + shift + 1"
                nothingFoundMessage="Nothing found..."
            >
                <SpotlightControl />
            </SpotlightProvider>
            <TaskStatusBar team={selectedTeam} setTeam={setSelectedTeam} />
            <PersonAccordion team={selectedTeam} />
        </div>
    );
}