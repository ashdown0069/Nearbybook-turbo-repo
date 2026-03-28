import { Module } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { LibrariesController } from './libraries.controller';
import { LibrariesDbService } from './libraries-db.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [LibrariesController],
  providers: [LibrariesService, LibrariesDbService],
  exports: [LibrariesService, LibrariesDbService],
})
export class LibrariesModule {}
