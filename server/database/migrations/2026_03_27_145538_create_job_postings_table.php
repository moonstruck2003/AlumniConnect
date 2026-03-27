<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobPostingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Recruiter posting the job
            $table->string('title');
            $table->string('company');
            $table->enum('type', ['job', 'internship'])->default('job');
            $table->string('location')->nullable();
            $table->text('description');
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('application_link')->nullable();
            $table->boolean('is_active')->default(true); // Toggle for recruiter profile
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
        Schema::dropIfExists('job_postings');
    }
}
