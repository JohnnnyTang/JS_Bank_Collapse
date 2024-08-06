<template>
  <div class="chart-visual">
    <section-visual
      :chartInfo="chartInfo"
      v-if="chartInfo.visualType === 'section'"
    ></section-visual>
    <!-- <section-contrast
      :chartInfo="chartInfo"
      v-if="chartInfo.visualType === 'sectionContrast'"
    /> -->
    <section-flush
      :chartInfo="chartInfo"
      v-if="chartInfo.visualType === 'sectionFlush'"
    />
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import SectionVisual from "../visual//SectionVisual.vue";
// import SectionContrast from "@/components/visual/SectionContrast.vue";
import SectionFlush from "../visual/SectionFlush.vue";
// import FlowSandZ from "@/components/visual/FlowSandZ.vue";
// import RateAndDirection from "@/components/visual/RateAndDirection.vue";
// import Salinity from "@/components/visual/Salinity.vue";
// import SandContent from "@/components/visual/SandContent.vue";
// import Suspension from "@/components/visual/Suspension.vue";

export default defineComponent({
  components: {
    SectionVisual,
    // SectionContrast,
    SectionFlush,
    // FlowSandZ,
    // RateAndDirection,
    // Salinity,
    // SandContent,
    // Suspension,
  },
  props: {
    chartVisualInfo: {
      type: Object,
    },
  },
  setup(props) {
    const chartInfo = computed(() => {
      return props.chartVisualInfo;
    });

    return {
      chartInfo,
    };
  },
});
</script>


<style lang="scss" scoped>
</style>
