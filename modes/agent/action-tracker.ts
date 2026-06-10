import type  {ActionLog,ActionStatus} from "./types.ts";
import {isMutationType} from "./types.ts";
export class ActionTracker {
    private actionLogs: ActionLog[] = [];

  log(
    entry: Omit<ActionLog, 'id' | 'timestamp'> & 
    { id?: string; timestamp?: Date },
  ): ActionLog {
     const action:ActionLog = {
        id: entry.id || `action_${this.actionLogs.length}`,
        timestamp: entry.timestamp ?? new Date(),
        type: entry.type,
        path: entry.path,
        details: entry.details,
        status: entry.status,
        userApproved:entry.userApproved,
     };
     this.actionLogs.push(action);
     return action;
  }

  getActions(){}

  getpendingMutations(){}
  

  updateStatus(){}



}