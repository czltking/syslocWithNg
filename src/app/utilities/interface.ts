export interface Task_Asset {
    CurrentRoute?: string
    CurrentRouteArray?: Array<[number, number]>
    TerminalType: { Description: string }
    UniqueidGPSTerminal: string
    ReturnRoute?: string
    Color?: string
    GPSTerminal?: { Code: string }
}
export interface Parameter {
    CenterPoint: { X: number, Y: number }
    Uid: string
    Type: string
    Task_Assetss: Array<Task_Asset>
    RegionPoint: Array<{ X: number, Y: number }>
    PlanningRoute?: boolean
    CustomRegion?: string
}