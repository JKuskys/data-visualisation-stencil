export interface IWidgetData {
    data: {value: number, label: string}[];
    min: number;
    max: number;
    errors: any;
    customLegend: string;
    customNegativePrimaryColor: string;
    customNegativeSecondaryColor: string;
    customPrimaryColor: string;
    customSecondaryColor: string;
    markNegativeDifferently: boolean;
    showLabels: boolean;
    showPeriods: boolean;
    showXGrid: boolean;
    showYGrid: boolean;
    widgetType: string;
    differentNegativeColors: boolean;
    markFirst: boolean;
    markLast: boolean;
    maxItems: number;
    title: string
}