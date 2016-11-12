DROP TABLE [dbo].[chaser_snapshots];
CREATE TABLE [dbo].[chaser_snapshots] (
    [id]         INT            NOT NULL,
    [date]       DATETIME       NOT NULL,
    [raw_status] NVARCHAR (MAX) NOT NULL,
    [victim_id] INT NOT NULL, 
    PRIMARY KEY CLUSTERED ([id] ASC), 
    CONSTRAINT [FK_chaser_snapshots_victims] FOREIGN KEY ([victim_id]) REFERENCES [chaser_victims]([id])
);
