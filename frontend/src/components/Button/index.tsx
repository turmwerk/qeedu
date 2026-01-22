import React from "react";

type ButtonVariant =
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger"
	| "text";

type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	loadingText?: React.ReactNode;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
};

const sizeClass: Record<ButtonSize, string> = {
	sm: "px-2.5 py-1.5 text-[12px] rounded-lg",
	md: "px-3.5 py-2 text-[14px] rounded-[10px]",
	lg: "px-4 py-2.5 text-[15px] rounded-[12px]",
};

const variantClass: Record<ButtonVariant, string> = {
	primary:
		"bg-[var(--brand-accent)] text-white border-0 hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]",
	secondary:
		"bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]",
	outline:
		"bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]",
	ghost: "bg-transparent border-0 text-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)]",
	danger:
		"bg-[#c21e1e] text-white border-0 hover:bg-[#a30f0f] hover:shadow-[0_10px_24px_rgba(194,30,30,0.2)]",
	text: "bg-transparent border-0 text-[var(--brand-accent)] hover:underline",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant,
			size,
			className,
			loading,
			loadingText,
			leftIcon,
			rightIcon,
			disabled,
			type,
			children,
			...rest
		},
		ref,
	) => {
		const isDisabled = disabled || loading;
		
		// 如果没有指定variant，则使用纯净模式，只保留原始className
		const finalClassName = variant
			? `inline-flex items-center gap-2 font-semibold cursor-pointer transition-[background,border-color,box-shadow,transform,opacity] active:scale-95 ${sizeClass[size ?? "md"]} ${variantClass[variant]} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${className ?? ""}`
			: `${className ?? ""}`;
		
		return (
			<button
				ref={ref}
				type={type ?? "button"}
				className={finalClassName}
				disabled={isDisabled}
				{...rest}
			>
				{loading ? (
					<span className="inline-flex items-center gap-2">
						<span className="h-3 w-3 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
						{loadingText ?? children}
					</span>
				) : (
					<>
						{leftIcon}
						{children}
						{rightIcon}
					</>
				)}
			</button>
		);
	},
);

Button.displayName = "Button";

export default Button;
