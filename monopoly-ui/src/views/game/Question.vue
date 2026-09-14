<template>
  <div class="message">
    <div class="message-icon">
      <span class="icon-text">?</span>
    </div>
    <div class="message-content">
      <p class="message-text">{{ content }}</p>
    </div>
  </div>
  <div class="action-buttons">
        <Button v-for="(option, index) in options" :key="index" size="large" @click="selectOption(option)">{{ option }}</Button>
  </div>
  <CashBoxModal :otherPlayerIndex="-1" :yourPlayerIndex="playerIndex" :payAmount="-reward" @confirmPay="pay" ref="cashBoxModal" />
</template>
<script>
import { Button } from 'view-ui-plus';
import CashBoxModal from './CashBoxModal.vue';
import { getPlayerQuestion,answerQuestion } from '@/api/gameApi.js';

export default {
  name: 'QuestionComponent',
  components: {
    Button,CashBoxModal
  },
  props: {
    playerIndex: {
      type: Number,
      default: -1
    }
  },
    data() {
        return {
            content: '',
            options: [],
            correctOption: null,
            selectedOption: null,
            reward: 0
        };
    },
    mounted(){
        getPlayerQuestion(this.playerIndex).then((question) => {
            this.content = question.stem;
            this.options = question.options;
            this.correctOption = question.correctOption;
            this.reward = question.reward;
        }).catch((error) => {
            console.error('Error fetching player question:', error);
        });
    },methods: {
        selectOption(option) {
            this.selectedOption = option;
            if (option === this.correctOption) {
                this.$Modal.success({
                    title: `恭喜你答对了！，请领取${this.reward}文奖励！`,
                    onOk: () => {
                        this.$refs.cashBoxModal.show();
                    }
                });
            } else {
                // Handle incorrect answer
                this.$Modal.error({
                    title: '很遗憾，答错了！',
                    onOk: () => {
                        // 消费掉错误的消息
                        answerQuestion({
                            playerIndex:this.playerIndex,
                            yourSelectedMoney:{},
                            otherSelectedMoney:{},
                            selectedOption:this.selectedOption
                        }).then(() => {
                            this.$emit('close');
                        }).catch((error) => {
                            console.error('Error answering question:', error);
                            this.$emit('close');
                        });
                    }
                });
            }
        },
        pay({yourSelectedMoney,otherSelectedMoney,successCallback,failCallback}) {
            console.log("after pay ... ,",yourSelectedMoney,otherSelectedMoney);
            answerQuestion({
                playerIndex:this.playerIndex,
                yourSelectedMoney,
                otherSelectedMoney,
                selectedOption:this.selectedOption
            }).then(() => {
                successCallback();
                this.$Modal.success({
                    title: `领取成功！`,
                    onOk: () => {
                        this.$emit('close');
                    }
                });
                
            }).catch((error) => {
                console.error('Error answering question:', error);
                failCallback();
                //显示领取失败
                this.$Modal.error({
                    title: `领取失败！`,
                });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/message.scss";
.action-buttons {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .ivu-btn {
        flex: 0 0 calc(50% - 8px);
        min-width: 0;
        font-size: 15px;
    }
}
</style>
