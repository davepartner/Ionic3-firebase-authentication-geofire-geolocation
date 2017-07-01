declare module 'geofire' {

    type EventType = 'ready' | 'key_entered' | 'key_exited' | 'key_moved';

    interface GeoQueryCriteria {
        center: number[];
        radius: number;
    }

    interface GeoQueryUpdateCriteria {
        center?: number[];
        radius?: number;
    }

    interface GeoCallbackRegistration {
        cancel();
    }

    interface GeoQuery {
        center(): number[];
        radius(): number;
        updateCriteria(criteria: GeoQueryUpdateCriteria);
        on(eventType: EventType, callback: (key:string, location: number[], distance: number) => void): GeoCallbackRegistration;
        cancel();
    }

    class GeoFire {
        constructor(ref: any);
        ref(): any;
        set(key: string, loc: number[]): Promise<void>;
        get(key: string): Promise<number[]>;
        remove(key: string): Promise<void>;
        query(criteria: GeoQueryCriteria): GeoQuery;
        static distance(location1: number[], location2: number[]);  
    }

    export = GeoFire;
    
    }