<template>

  <li
    class="item-wrapper"
    :class="{selected: isSelected, draggable}"
  >
    <a
      tabindex="0"
      class="inner-link"
      :class="focusRing"
      @click="handleSelect"
      @keyup.enter.stop.prevent="handleSelect"
    >
      <span class="text">{{ text }}</span>
      <CoachContentLabel
        class="coach-content-label"
        :value="isCoachContent ? 1 : 0"
        :isTopic="false"
      />
    </a>
    <div v-if="draggable" class="handle">
      <KDragSortWidget
        :isFirst="isFirst"
        :isLast="isLast"
        :moveUpText="$tr('moveExerciseUp')"
        :moveDownText="$tr('moveExerciseDown')"
        @moveDown="$emit('moveDown')"
        @moveUp="$emit('moveUp')"
      />
    </div>
  </li>

</template>


<script>

  import themeMixin from 'kolibri.coreVue.mixins.themeMixin';
  import CoachContentLabel from 'kolibri.coreVue.components.CoachContentLabel';
  import KDragSortWidget from 'kolibri.coreVue.components.KDragSortWidget';

  export default {
    name: 'AssessmentQuestionListItem',
    $trs: {
      questionNum: 'Question {number, number, integer}:',
      questionNumShort: '{number, number, integer}.',
      preview: 'Preview',
      view: 'View',
      nthExerciseName: '{ name } ({number, number, integer})',
      moveExerciseUp: 'Move this exercise up by one position',
      moveExerciseDown: 'Move this exercise down by one position',
    },
    components: {
      CoachContentLabel,
      KDragSortWidget,
    },
    mixins: [themeMixin],
    props: {
      draggable: {
        type: Boolean,
        required: true,
      },
      questionNumberOfExercise: {
        type: Number,
        required: false,
      },
      isSelected: {
        type: Boolean,
        required: true,
      },
      exerciseName: {
        type: String,
        required: true,
      },
      isCoachContent: {
        type: Boolean,
        required: true,
      },
      isFirst: {
        type: Boolean,
        default: false,
      },
      isLast: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      text() {
        if (this.questionNumberOfExercise === undefined) {
          return this.exerciseName;
        }
        return this.$tr('nthExerciseName', {
          name: this.exerciseName,
          number: this.questionNumberOfExercise,
        });
      },
      focusRing() {
        return this.$computedClass({ ':focus': this.$coreOutline });
      },
    },
    methods: {
      handleSelect() {
        this.$emit('select');
      },
    },
  };

</script>


<style lang="scss" scoped>

  .item-wrapper {
    position: relative;
    left: -8px;
    display: block;
    width: 100%;
    padding: 8px;
    overflow: visible;
    text-align: left;
    white-space: nowrap;
    user-select: none;
    background-color: white;
    border-radius: 4px;
  }

  .inner-link {
    display: block;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .selected {
    background-color: #e8e8e8;
  }

  .draggable {
    padding-right: 50px;
    padding-left: 8px;
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
  }

  .nowrap {
    white-space: nowrap;
  }

  .text {
    cursor: pointer;
  }

  .handle {
    position: absolute;
    top: 6px;
    right: 4px;
  }

  .hidden-buttons {
    display: none;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>
