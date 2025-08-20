import { _decorator, Component, Node, Sprite, tween, Vec3, Quat, randomRangeInt } from 'cc';
import { itemSpin } from './itemSpin';
const { ccclass, property } = _decorator;

export enum LuckySpinType {
    Thief = 0,
    Coin = 1,
}

@ccclass('LuckySpin')
export class LuckySpin extends Component {

    @property(Sprite)
    wheelStarmina: Sprite = null!;

    @property(Node)
    wheel: Node = null!;

    @property([itemSpin])
    items: itemSpin[] = [];

    @property
    spinDuration: number = 3;

    @property
    spinRounds: number = 5;

    private isSpinning: boolean = false;
    private currentAngle: number = 0;

    start() {
        // Khởi tạo góc quay ban đầu
        this.currentAngle = 0;
    }

    spin() {
        if (this.isSpinning || this.wheelStarmina.fillRange < 0.11) return;
        this.wheelStarmina.fillRange -= 0.11;
        this.isSpinning = true;
        
        // Tính toán góc quay ngẫu nhiên
        const itemCount = this.items.length;
        const itemAngle = 360 / itemCount;
        const randomIndex = randomRangeInt(0, itemCount);
        const targetAngle = this.currentAngle + 360 * this.spinRounds + (randomIndex * itemAngle);
        
        // Tạo animation quay
        tween(this.wheel)
            .to(this.spinDuration, 
                { angle: -targetAngle },
                {
                    easing: 'cubicOut',
                    onUpdate: (target, ratio) => {
                        this.currentAngle = target.angle;
                    },
                    onComplete: () => {
                        this.isSpinning = false;
                        console.log('Item selected:', randomIndex);
                        console.log(this.items[randomIndex]);
                    }
                }
            )
            .start();
    }
} 