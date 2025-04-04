import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { DatabaseModule } from "../database/database.module";
import { ScheduleModule } from "@nestjs/schedule";
import { AutomationSummaryScheduler } from "./cron/automation-summary.schedule";
import { ProcessAutomationSummaryUseCase } from "@/domain/dashboard/application/use-cases/process-automarion-summary";
import { ConsumptionScheduler } from "./cron/consumption.schedule";
import { ProcessConsumptionOnMonthUseCase } from "@/domain/dashboard/application/use-cases/process-consumption-on-month";

@Module({
    imports: [
        EnvModule,
        DatabaseModule,
        ScheduleModule.forRoot(),
    ],
    providers: [
        ProcessAutomationSummaryUseCase,
        ProcessConsumptionOnMonthUseCase,
        AutomationSummaryScheduler,
        ConsumptionScheduler,
    ],
})
export class SchedulerModule {}
