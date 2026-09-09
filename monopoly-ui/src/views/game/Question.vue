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
.message {
    padding: 20px 16px 12px;
    background: linear-gradient(135deg, #fdf6e3 0%, #f5e6c8 100%);
    border-radius: 12px;
    text-align: center;
    position: relative;
    border: 2px solid #d4a853;
    box-shadow: 0 4px 16px rgba(212, 168, 83, 0.2);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #d4a853, #f0c060, #d4a853);
        border-radius: 12px 12px 0 0;
    }
}

.message-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: linear-gradient(145deg, #fff8e7, #f5e6c8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(212, 168, 83, 0.3);
    border: 3px solid #e8c87a;
    animation: float 2s ease-in-out infinite;
}

.icon-text {
    font-size: 32px;
    line-height: 1;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-4px);
    }
}

.message-content {
    padding: 8px 4px;
}

.message-text {
    font-size: 17px;
    color: #5a4a3a;
    line-height: 1.8;
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.5px;
}

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
