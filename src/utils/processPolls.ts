import { prisma } from "../prisma/client";

async function processPolls() {
    try {
        const polls = await prisma.poll.findMany({
            where: {
                endsAt: {
                    lte: new Date()
                }
            }
        });

        for (const poll of polls) {
        }
    } catch (error) {
        console.log(error);
    }
}

export default processPolls;