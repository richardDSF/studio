<?php

declare(strict_types=1);

namespace App\Models\Rewards;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RewardRedemption extends Model
{
    use HasFactory;

    protected $table = 'reward_redemptions';

    protected $fillable = [
        'reward_user_id',
        'catalog_item_id',
        'points_spent',
        'status',
        'notes',
        'admin_notes',
        'processed_by',
        'processed_at',
        'metadata',
    ];

    protected $casts = [
        'reward_user_id' => 'integer',
        'catalog_item_id' => 'integer',
        'points_spent' => 'integer',
        'processed_by' => 'integer',
        'processed_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    /**
     * Redemption statuses
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_FULFILLED = 'fulfilled';
    public const STATUS_CANCELLED = 'cancelled';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
        self::STATUS_FULFILLED,
        self::STATUS_CANCELLED,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the reward user
     */
    public function rewardUser(): BelongsTo
    {
        return $this->belongsTo(RewardUser::class);
    }

    /**
     * Get the catalog item
     */
    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(RewardCatalogItem::class, 'catalog_item_id');
    }

    /**
     * Get the admin who processed
     */
    public function processedByUser(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'processed_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to filter by status
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get pending redemptions
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope to get approved redemptions
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope to get completed (fulfilled) redemptions
     */
    public function scopeFulfilled($query)
    {
        return $query->where('status', self::STATUS_FULFILLED);
    }

    /**
     * Scope to filter by date range
     */
    public function scopeBetweenDates($query, $start, $end)
    {
        return $query->whereBetween('created_at', [$start, $end]);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Check if redemption is pending
     */
    public function getIsPendingAttribute(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if redemption is approved
     */
    public function getIsApprovedAttribute(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if redemption is fulfilled
     */
    public function getIsFulfilledAttribute(): bool
    {
        return $this->status === self::STATUS_FULFILLED;
    }

    /**
     * Check if redemption can be cancelled
     */
    public function getCanBeCancelledAttribute(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING,
            self::STATUS_APPROVED,
        ]);
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING => 'Pendiente',
            self::STATUS_APPROVED => 'Aprobado',
            self::STATUS_REJECTED => 'Rechazado',
            self::STATUS_FULFILLED => 'Completado',
            self::STATUS_CANCELLED => 'Cancelado',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get status color for UI
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING => 'yellow',
            self::STATUS_APPROVED => 'blue',
            self::STATUS_REJECTED => 'red',
            self::STATUS_FULFILLED => 'green',
            self::STATUS_CANCELLED => 'gray',
            default => 'gray',
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Approve the redemption
     */
    public function approve(int $adminId, ?string $notes = null): self
    {
        $this->status = self::STATUS_APPROVED;
        $this->processed_by = $adminId;
        $this->processed_at = now();
        
        if ($notes) {
            $this->admin_notes = $notes;
        }
        
        return $this;
    }

    /**
     * Reject the redemption
     */
    public function reject(int $adminId, ?string $reason = null): self
    {
        $this->status = self::STATUS_REJECTED;
        $this->processed_by = $adminId;
        $this->processed_at = now();
        
        if ($reason) {
            $this->admin_notes = $reason;
        }
        
        return $this;
    }

    /**
     * Mark as fulfilled
     */
    public function fulfill(int $adminId, ?string $notes = null): self
    {
        $this->status = self::STATUS_FULFILLED;
        $this->processed_by = $adminId;
        $this->processed_at = now();
        
        if ($notes) {
            $this->admin_notes = $notes;
        }
        
        return $this;
    }

    /**
     * Cancel the redemption
     */
    public function cancel(?string $reason = null): self
    {
        $this->status = self::STATUS_CANCELLED;
        
        if ($reason) {
            $this->admin_notes = $reason;
        }
        
        return $this;
    }
}
