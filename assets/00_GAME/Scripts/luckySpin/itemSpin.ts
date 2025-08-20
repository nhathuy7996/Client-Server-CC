import { _decorator, Component, Label, Node } from 'cc';
import { LuckySpinType } from './LuckySpin';
const { ccclass, property } = _decorator;

@ccclass('itemSpin')
export class itemSpin extends Component {

    @property({ type: LuckySpinType })
    type: LuckySpinType = LuckySpinType.Thief;

    @property(Label)
    labelReward: Label = null!;

    @property(Number)
    reward: number = 0;
     
    onFocusInEditor(): void {
        this.labelReward = this.getComponentInChildren(Label);
    }
}

