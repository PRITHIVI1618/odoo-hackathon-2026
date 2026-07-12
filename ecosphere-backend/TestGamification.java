public class TestGamification {
    private static final int BASE_XP = 250;
    private static final double XP_MULTIPLIER = 1.5;

    public static int calculateXpForLevel(int level) {
        if (level <= 1) return 0;
        int xp = 0;
        for (int i = 1; i < level; i++) {
            xp += (int) (BASE_XP * Math.pow(XP_MULTIPLIER, i - 1));
        }
        return (Math.round((float) xp / 50) * 50);
    }

    public static int getLevelForXp(int xp) {
        int level = 1;
        while (xp >= calculateXpForLevel(level + 1)) {
            level++;
            if(level > 100) { System.out.println("Infinite loop! level=" + level); break; }
        }
        return level;
    }

    public static void main(String[] args) {
        System.out.println("Level for 0 XP: " + getLevelForXp(0));
        System.out.println("Level for 250 XP: " + getLevelForXp(250));
        System.out.println("Level for 850 XP: " + getLevelForXp(850));
        System.out.println("Level for 2500 XP: " + getLevelForXp(2500));
    }
}
