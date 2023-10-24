import assert from 'assert';
import path from 'path';
import * as cdk from 'aws-cdk-lib';

(async () => {
  const app = new cdk.App();
  const stackName: string | undefined = app.node.tryGetContext('stackName');
  assert(stackName, 'Missing stage from context');

  const stack = new cdk.Stack(app, stackName);

  const lambdaRole = new cdk.aws_iam.Role(stack, 'role', {
    roleName: stack.stackName,
    assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com') as cdk.aws_iam.IPrincipal,
    managedPolicies: [
      cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    ],
  });

  lambdaRole.addToPolicy(new cdk.aws_iam.PolicyStatement({
    effect: cdk.aws_iam.Effect.ALLOW,
    actions: [ 'logs:PutRetentionPolicy', 'logs:DeleteRetentionPolicy' ],
    resources: [ '*' ],
  }));

  const environment = stack.stackName.endsWith('-prod') ? {
    NODE_ENV: 'production',
  } : {
    NODE_ENV: 'development',
  };

  const lambdaFunction = new cdk.aws_lambda.Function(stack, 'lambda', {
    functionName: stack.stackName,
    runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
    code: cdk.aws_lambda.Code.fromAsset(path.resolve(__dirname, '../'), {
      exclude: [
        '*/*',
        '!aws-lambda/**',
        'aws-lambda/cdk.out/**',
        'aws-lambda/cdk.out/.cache/*',
        '!aws-lambda/*.js*',
        '!server/**',
      ],
    }),
    handler: 'aws-lambda/lambda.handler',
    role: lambdaRole as cdk.aws_iam.IRole,
    timeout: cdk.Duration.seconds(29),
    environment,
  });

  const lambdaUrl = lambdaFunction.addFunctionUrl({
    authType: cdk.aws_lambda.FunctionUrlAuthType.NONE,
  });

  return {
    lambdaRole,
    lambdaFunction,
    lambdaUrl,
  };
})();
