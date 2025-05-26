interface EventPayloads {
    [key: string]: unknown; // Add an index signature
    [key: symbol]: unknown; // Add an index signature for symbol keys
    success: string;  // Event 'success' will have a payload of type string
    error: string;    // Event 'error' will have a payload of type string
    taskCreated: {
        id: string;
        team: string;
        assigned_to: string;
        summary: string;
        start_date: string;
        end_date: string;
        original_estimate: number;
        estimation: number;
    };
    // Add other event types here if needed
}

import mitt from "mitt";

export const emitter = mitt<EventPayloads>();