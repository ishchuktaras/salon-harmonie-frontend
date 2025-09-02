"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const chartId = `chart-${id || React.useId()}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve]:stroke-primary [&_.recharts-dot_path]:fill-primary [&_.recharts-layer:focus-visible]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle]:fill-primary [&_.recharts-reference-line-line]:stroke-border [&_.recharts-sector_path]:fill-primary [&_.recharts-sector:focus-visible]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const configString = Object.entries(config)
    .map(([key, value]) => {
      const color = value.theme?.light ?? value.color;
      return color ? `${key}: ${color}` : ''
    })
    .join(";")

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
  --chart-font-family: var(--font-sans);
  --chart-primary: hsl(var(--primary));
  ${configString}
}`,
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      indicator?: "dot" | "line" | "dashed"
      hideLabel?: boolean
      hideIndicator?: boolean
      labelKey?: string
      nameKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const formattedLabel = React.useMemo(() => {
      if (hideLabel || !payload || !payload.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || "value"}`
      const itemConfig = config[key]
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter && value) {
        return labelFormatter(value, payload)
      }

      return value
    }, [label, labelFormatter, payload, hideLabel, config, labelKey])

    if (!active || !payload || !payload.length) {
      return null
    }

    const items = payload.map((item) => {
      const key = `${nameKey || item.name || "value"}`
      const itemConfig = config[key]
      const indicatorColor = itemConfig?.color

      return (
        <div
          key={item.dataKey}
          className={cn("flex items-center gap-2 [&>svg]:size-2.5")}
        >
          {!!itemConfig?.icon && <itemConfig.icon />}
          {!hideIndicator && (
            <div
              className={cn(
                "shrink-0 rounded-[2px] border-[1px] border-transparent",
                {
                  "size-2.5": indicator === "dot",
                  "w-1 h-4": indicator === "line",
                  "w-1 h-4 border-dashed": indicator === "dashed",
                }
              )}
              style={{
                background: indicatorColor,
              }}
            />
          )}
          <div
            className={cn("flex flex-1 justify-between leading-none")}
          >
            <div className={cn("text-muted-foreground")}>
              {itemConfig?.label || item.name}
            </div>
            {formatter && item.value !== undefined && item.name !== undefined && (
              <div className={cn("font-bold")}>
                {formatter(item.value, item.name, item, 0, payload)}
              </div>
            )}
          </div>
        </div>
      )
    })

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && formattedLabel ? (
          <div className={cn("font-bold", labelClassName)}>
            {formattedLabel}
          </div>
        ) : null}
        <div className="grid gap-1.5">{items}</div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload || !payload.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.value || "value"}`
          const itemConfig = config[key]

          return (
            <div
              key={item.value as string}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:shrink-0"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Re-export all Recharts components
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
export const ChartArea = RechartsPrimitive.Area
export const ChartBar = RechartsPrimitive.Bar
export const ChartLine = RechartsPrimitive.Line
export const ChartComposed = RechartsPrimitive.ComposedChart
export const ChartPie = RechartsPrimitive.Pie
export const ChartRadar = RechartsPrimitive.Radar
export const ChartRadialBar = RechartsPrimitive.RadialBar
export const ChartScatter = RechartsPrimitive.Scatter
export const ChartFunnel = RechartsPrimitive.Funnel
export const ChartSankey = RechartsPrimitive.Sankey
export const ChartTreeMap = RechartsPrimitive.Treemap
export const ChartAxis = RechartsPrimitive.XAxis
export const ChartYAxis = RechartsPrimitive.YAxis
export const ChartZAxis = RechartsPrimitive.ZAxis
export const ChartGrid = RechartsPrimitive.CartesianGrid
export const ChartReferenceLine = RechartsPrimitive.ReferenceLine
export const ChartBrush = RechartsPrimitive.Brush
export const ChartLabel = RechartsPrimitive.Label
export const ChartLabelList = RechartsPrimitive.LabelList
export const ChartCell = RechartsPrimitive.Cell
export const ChartErrorBar = RechartsPrimitive.ErrorBar

