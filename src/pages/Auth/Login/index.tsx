import React from 'react';
import PageHeader from '@/components/base/PageHeader';
import shared from '@/pages/shared/style.module.scss';

export default function Login() {
	return (
		<div>
			<PageHeader title="登录" />
			<div className={shared.content}>
				<p>Login Page</p>
			</div>
		</div>
	);
}
