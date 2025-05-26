import { Accordion, ActionIcon, AccordionControlProps, Box, Container } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import TasksDistributedOnStatus from './TasksDistributedOnStatus';

function AccordionControl(props: AccordionControlProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Accordion.Control {...props} />
            <ActionIcon size="lg">
                <IconDots size="1rem" />
            </ActionIcon>
        </Box>
    );
}

export default function PersonAccordion(props: any) {
    // Track expanded state
    const [expanded, setExpanded] = useState<string | null>(null);
    const team = props.team;

    return (
        <Container className="py-8" size={'xl'}>
            <Accordion
                chevronPosition="left"
                maw={950}
                mx="left"
                multiple={false} // Only one item expands at a time
                value={expanded}
                onChange={setExpanded}
            >
                {team?.members?.map((member: any) => {
                    const value = `item-${member.id}`;
                    return (
                        <Accordion.Item key={value} value={value}>
                            <AccordionControl>{member.name}</AccordionControl>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: expanded === value ? 'auto' : 0,
                                    opacity: expanded === value ? 1 : 0
                                }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <Accordion.Panel className="p-2 -ml-6">
                                    <TasksDistributedOnStatus tasks={member?.tasks} memberId={member?.id} teamId={team?.id} />
                                </Accordion.Panel>
                            </motion.div>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </Container>
    );
}
