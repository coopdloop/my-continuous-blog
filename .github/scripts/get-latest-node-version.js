import { getOctokit, context } from '@actions/github';
import * as core from '@actions/core';

async function run() {
  try {
    const octokit = getOctokit(process.env.GITHUB_TOKEN);
    const { owner, repo } = context.repo;

    const workflow = await octokit.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: 'ci.yml',
      status: 'success',
      per_page: 1
    });

    if (workflow.data.workflow_runs.length === 0) {
      throw new Error('No successful CI workflow runs found');
    }

    const workflowRun = workflow.data.workflow_runs[0];
    const jobs = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: workflowRun.id
    });

    const determineLatestNodeJob = jobs.data.jobs.find(job => job.name === 'determine-latest-node');
    if (!determineLatestNodeJob) {
      throw new Error('Could not find determine-latest-node job');
    }

    const setLatestNodeStep = determineLatestNodeJob.steps.find(step => step.name === 'Set latest Node.js version');
    if (!setLatestNodeStep || !setLatestNodeStep.outputs || !setLatestNodeStep.outputs.latest_node) {
      throw new Error('Could not find latest_node output in Set latest Node.js version step');
    }

    core.setOutput('node-version', setLatestNodeStep.outputs.latest_node);
  } catch (error) {
    core.warning(`Failed to get latest Node.js version: ${error.message}`);
    core.warning('Falling back to default Node.js version');
    core.setOutput('node-version', '24.12.0'); // Fallback to the latest version in your CI matrix
  }
}

run();
