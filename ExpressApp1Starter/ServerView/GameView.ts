﻿
import { EventEmitter } from 'events';
import { GameStatus } from "../ServerControl/ServerTimeController";

export class GameView {
    private m_scenario;
    private m_worldID;
    private m_serverSocket;
    private m_model;
    private m_status: GameStatus;
    private m_emit: EventEmitter;
    private m_debugTime: number = Date.now();

    constructor(p_scenario, p_worldID, p_serverSocket) {
        this.m_scenario = p_scenario;
        this.m_worldID = p_worldID;
        this.m_serverSocket = p_serverSocket;
        this.m_status = GameStatus.paused;
    }
    public setModel(p_model) {
        this.m_model = p_model;
    }
    public setStatus(p_status: GameStatus) {
        this.m_status = p_status;
    }
    public getStatus(): GameStatus {
        return this.m_status;
    }
    
    public tick() {
        var data = this.createTickData();
        this.emitTickToWorldID(this.m_worldID, data);
        //if (this.m_worldID == 95112)
            //console.log("emit was sent, time: " + this.m_model.getTime());
        this.m_model.tickWasSent(); 
    }
    public createTickData(): { w:string, t: number, s: { c: number, s: number, v: number, o: number }, i: {}, o: { e: number, h: number, a: number, g: number }[], d: {}, dt: number }  {
        //c: combined score, s: social score, v: environmental score, o: economic score
        //e: emisionsCO2, h:housingTemp, a: airTemp, g: gnp

        //var tmp1 = this.m_model.getTime();
        //var tmp2 = this.m_model.getScores();
        //var tmp3 = this.m_model.getIndicatorData();
        //var tmp4 = this.m_model.getOverlays();
        var date = new Date();
        return {
            w: this.m_worldID, // worldID
            t: this.m_model.getTime(), // time
            s: this.m_model.getScores(), // scores
            i: this.m_model.getIndicatorData(), // indicators
            o: this.m_model.getOverlays(), // overlays
            d: this.m_model.getDecisionsSinceLastTick(), // decisions
            dt: date.getTime()
        }
    }
    private emitTickToWorldID(p_worldID, p_tickData) {
        var now: number = Date.now();
        if (this.m_worldID == 35598 || this.m_worldID == 95112 || this.m_worldID == 65640) 
            console.log("emitting tick: "+ this.m_model.getTime() + " to world: " + this.m_worldID + "  deltaTime: " + (Date.now() - this.m_debugTime.valueOf()) + " ms");
        this.m_debugTime = Date.now();
        this.m_serverSocket.emit("tickFromServer" + p_worldID, p_tickData);
    }

    public profileChangeOfWorldID(p_data) {
        var data = {
            currentRole: p_data.m_currentRole, nickName: p_data.m_nickName, pin: p_data.m_pin
        };
        console.log("Send RoleChange: " + JSON.stringify(data));
        this.m_serverSocket.emit("profileChangeFromServer" + this.m_worldID, data);
    }
    private createProfileData() {

    }
    private emitProfileToWorldID(p_worldID, p_profileData) {

    }
    public changeDecision() {

    }
    public createDecisionData() {
        return this.m_model.getCurrentDecisions();
    }
}