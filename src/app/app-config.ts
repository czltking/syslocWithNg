import { MapConifg } from "cloudy-location";

export interface ICate {
    "class": string,
    "title": string,
    "code": string,
    "color": string,
    "visable": boolean,
    "mp": boolean,
    "count": number
}

export interface AppConfig {
    "asset-profile-url"?: string
    "multiPanelConfiguration"?: {
        "items": Array<
        {
            "class": string,
            "title": string,
            "code": string,
            "disable": boolean
        }
        >,
        "taskListSource": {
            "url": string
        }
    },
    "toolbar"?: {
        "items": Array<ICate>,
        "itemsDetailed": Array<ICate>
    },
    "map"?: MapConifg
}
