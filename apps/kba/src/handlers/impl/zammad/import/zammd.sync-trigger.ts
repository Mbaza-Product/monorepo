import { Controller, Post } from "@nestjs/common";
import { ZammadSynchronizationJob } from "./zammad.sync-job";

@Controller("/sync/zammad")
export class ZammdSyncTrigger {

  constructor(private syncJob: ZammadSynchronizationJob) {}

  @Post()
  async triggerSync() {
    this.syncJob.synchronizeContent();
  }
}