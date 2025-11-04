export const maxDuration = (subscription: string | null): number => {


    let maxDuration: number;
    switch (subscription) {
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