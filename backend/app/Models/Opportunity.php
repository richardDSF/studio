<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Opportunity extends Model
{
    use HasFactory;

    protected $table = 'opportunities';

    protected $fillable = [
        'lead_cedula',
        'opportunity_type',
        'vertical',
        'amount',
        'status',
        'expected_close_date',
        'comments',
        'assigned_to_id'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expected_close_date' => 'date',
    ];

    // Relación con Lead (FK: lead_cedula -> persons.cedula)
    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_cedula', 'cedula');
    }

    // Relación con User (Agente asignado)
    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }
}
