<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMentorshipRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('mentorship_requests', function (Blueprint $table) {
        $table->id();
        // Student je request pathabe
        $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
        // Alumni jar kache request jabe
        $table->foreignId('alumni_id')->constrained('users')->onDelete('cascade');
        // Status handling (By default 'pending' thakbe)
        $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
        $table->text('message')->nullable(); 
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mentorship_requests');
    }
}
