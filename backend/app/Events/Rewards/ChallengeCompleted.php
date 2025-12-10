<?php

declare(strict_types=1);

namespace App\Events\Rewards;

use App\Models\Rewards\RewardUser;
use App\Models\Rewards\RewardChallenge;
use App\Models\Rewards\RewardChallengeParticipation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChallengeCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public RewardUser $rewardUser,
        public RewardChallenge $challenge,
        public RewardChallengeParticipation $participation,
        public array $context = []
    ) {}

    /**
     * Get the user ID
     */
    public function getUserId(): int
    {
        return $this->rewardUser->user_id;
    }

    /**
     * Get challenge name
     */
    public function getChallengeName(): string
    {
        return $this->challenge->name;
    }

    /**
     * Get points reward
     */
    public function getPointsReward(): int
    {
        return $this->challenge->points_reward ?? 0;
    }

    /**
     * Get XP reward
     */
    public function getXpReward(): int
    {
        return $this->challenge->xp_reward ?? 0;
    }

    /**
     * Get challenge type
     */
    public function getChallengeType(): string
    {
        return $this->challenge->type;
    }
}
