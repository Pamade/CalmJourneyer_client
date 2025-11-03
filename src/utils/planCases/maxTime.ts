import type { Subscription } from '../planCases/planTypes';

export const maxDuration = (subscription: Subscription | null): number => {


    let maxDuration: number;
    switch (subscription?.plan) {
        case 'free'.toLowerCase():
            maxDuration = 5;
            break;
        case 'standard'.toLowerCase():
            maxDuration = 15;
            break;
        case 'pro'.toLowerCase():
            maxDuration = 30;
            break;
        default: maxDuration = 5;
    }
    return maxDuration;
}