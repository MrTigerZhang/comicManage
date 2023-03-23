<template>
  <vue-dropzone
    ref="myDropzone"
    :id="id"
    :options="dropzoneOptions"
    :use-custom-slot="true"
    @vdropzone-removed-file="dropzoneRemovedFile"
    @vdropzone-success="dropzoneSuccess"
    @vdropzone-added-file="dropzoneAddedFile"
    @vdropzone-queue-complete="dropzoneQueueComplete"
  >
    <div class="dropzone-custom-content">
      <h3 class="dropzone-custom-title" :style="{color: themeColor}">
        Drag and drop to upload content!
      </h3>
      <div class="subtitle">
        ...or click to select a file from your computer
      </div>
    </div>
  </vue-dropzone>
</template>

<script lang="ts">
import VueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'

@Component({
  name: 'Dropzone',
  components: {
    VueDropzone
  }
})
export default class extends Vue {
  // You can add more Prop, see: https://www.dropzonejs.com/#configuration
  @Prop({ required: true }) private id!: string;
  @Prop({ required: true }) private url!: string;
  @Prop({ default: 200 }) private thumbnailHeight!: number;
  @Prop({ default: 200 }) private thumbnailWidth!: number;
  @Prop({ default: 40 }) private maxFiles!: number;
  @Prop({ default: 50 }) private maxFilesize!: number; // In MB

  @Prop({ default: true }) private addRemoveLinks!: boolean;
  @Prop({ default: 'Drop files here to upload' })
  private dictDefaultMessage!: string;

  @Prop({ default: 'Your broswer does not support dropzone.js' })
  private dictFallbackMessage!: string;

  @Prop({ default: 'Remove' }) private dictRemoveFile!: string;
  @Prop({ default: 'Max Files Exceeded' })
  private dictMaxFilesExceeded!: string;

  get dropzoneOptions() {
    return {
      url: this.url,
      thumbnailWidth: this.thumbnailWidth,
      thumbnailHeight: this.thumbnailHeight,
      maxFiles: this.maxFiles,
      maxFilesize: this.maxFilesize,
      parallelUploads: 1,
      autoProcessQueue: true,
      addRemoveLinks: this.addRemoveLinks,
      dictDefaultMessage: this.dictDefaultMessage,
      dictFallbackMessage: this.dictFallbackMessage,
      dictRemoveFile: this.dictRemoveFile,
      dictMaxFilesExceeded: this.dictMaxFilesExceeded
    }
  }

  get themeColor() {
    return SettingsModule.theme
  }

  // You can add more Event handler, see: https://rowanwins.github.io/vue-dropzone/docs/dist/#/events
  private dropzoneSuccess(file: File, response: any) {
    this.$emit('dropzone-success', file, response);
    (this.$refs.myDropzone as any).removeFile(file)
  }

  private dropzoneRemovedFile(file: File, error: Error, xhr: XMLHttpRequest) {
    this.$emit('dropzone-removed-file', file, error, xhr)
  }

  private dropzoneAddedFile(file: File) {
    // Process the queue when a new file is added

    (this.$refs.myDropzone as any).processQueue()
    console.log(file.name)
  }

  private dropzoneQueueComplete() {
    // Handle the event when the queue is complete
    console.log('All files have been processed')
  }
}
</script>

<style lang="scss" scoped>
.dropzone-custom-content {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.subtitle {
  color: #314b5f;
}

.dropzone {
  min-height: 150px;
}
</style>
