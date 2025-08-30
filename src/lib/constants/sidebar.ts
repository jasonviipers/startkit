import {
    RiCodeSSlashLine,
    RiLineChartLine,
    RiToolsFill,
    RiSettingsLine,
    RiSpeedUpLine,
    RiBankCardLine
} from "@remixicon/react"


export const SIDEBAR_DATA = {
    navMain: [
        {
            title: "General",
            items: [
                {title: "Dashboard",url: "/dashboard",icon: RiSpeedUpLine},
                {title: "Analytics",url: "/dashboard/analytics",icon: RiLineChartLine},
                {title: "Integrations",url: "/dashboard/integrations",icon: RiToolsFill},
                {title: "Settings",url: "/dashboard/settings",icon: RiSettingsLine},
                {title: "Billing",url: "/dashboard/billing",icon: RiBankCardLine},
                {title: "API",url: "/dashboard/api",icon: RiCodeSSlashLine},
            ]
        }
    ],
}